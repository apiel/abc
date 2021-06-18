import { basename, dirname } from 'path';
// should we use fetch over axios?
import axios, { AxiosRequestConfig } from 'axios';

import { Storage } from './Storage';
import { ERR } from '../error';
import { getGithubRepo, getGithubToken, getGithubUser } from './localStorage';

const BASE_URL = 'https://api.github.com';
const COMMIT_PREFIX = '[wasist]';

export class GitHubStorage extends Storage {
    async readdir(path: string) {
        try {
            const { data } = await this.getContents(path);
            return data.map(({ name }: any) => name) as string[]; // type is also available so we could filter for type === 'file'
        } catch (error) {
            if (error?.response?.status === 404) {
                return [] as string[];
            }
            throw error;
        }
    }

    async image(path: string) {
        const { data } = await this.getContents(path);
        if (data.content) {
            return Buffer.from(data.content, 'base64');
        }
        return data.download_url;
    }

    async blob(path: string) {
        const { data } = await this.getContents(dirname(path)); // we might need to increase limit
        const filename = basename(path);
        const filedata = data.find((item: any) => item.name === filename);
        if (!filedata) {
            return;
        }
        const {
            data: { content },
        } = await this.call({
            url: `${this.blobUrl}/${filedata.sha}`,
        });
        return Buffer.from(content, 'base64');
    }

    async saveBlob(file: string, content: Buffer) {
        await this.remove(file);
        const {
            data: [
                {
                    sha: latestCommitSha,
                    commit: {
                        tree: { sha: base_tree },
                    },
                },
            ],
        } = await this.call({
            url: `${this.baseRepo}/commits`,
        });

        const {
            data: { sha: newBlobSha },
        } = await this.call({
            method: 'POST',
            url: this.blobUrl,
            data: {
                content: content.toString('base64'),
                encoding: 'base64',
            },
        });

        const {
            data: { sha: newTreeSha },
        } = await this.call({
            method: 'POST',
            url: `${this.baseRepo}/git/trees`,
            data: {
                base_tree,
                tree: [
                    {
                        path: file,
                        mode: '100644',
                        sha: newBlobSha,
                    },
                ],
            },
        });

        const {
            data: { sha: shaCommit },
        } = await this.call({
            method: 'POST',
            url: `${this.baseRepo}/git/commits`,
            data: {
                message: `${COMMIT_PREFIX} save blob`,
                tree: newTreeSha,
                parents: [latestCommitSha],
            },
        });

        await this.call({
            method: 'PATCH',
            url: `${this.baseRepo}/git/refs/heads/master`,
            data: {
                sha: shaCommit,
            },
        });
        // console.log('Blob saved', file);
    }

    async read(path: string) {
        const {
            data: { content },
        } = await this.getContents(path);
        return Buffer.from(content, 'base64');
    }

    async readJSON(path: string) {
        if (!this.token || !this.user) {
            throw new Error(ERR.missingGitHubConfig);
        }
        try {
            return JSON.parse((await this.read(path)).toString());
        } catch (error) {
            return undefined;
        }
    }

    async remove(file: string) {
        const {
            data: { sha },
        } = await this.getContents(file);
        const data = JSON.stringify({
            message: `${COMMIT_PREFIX} delete file`,
            sha,
        });
        await this.call({
            method: 'DELETE',
            url: `${this.contentsUrl}/${file}`,
            data,
        });
    }

    async saveFile(file: string, content: string) {
        if (!this.repo) {
            throw new Error('GitHub repository required.');
        }
        const sha = await this.getSha(file);
        const data = JSON.stringify({
            message: `${COMMIT_PREFIX} save file`,
            content: Buffer.from(content).toString('base64'),
            ...(sha && { sha }),
        });
        await this.call({
            method: 'PUT',
            url: `${this.contentsUrl}/${file}`,
            data,
        });
    }

    protected async getSha(file: string) {
        try {
            const { data } = await this.getContents(file);
            if (data?.sha) {
                return data.sha;
            }
        } catch (error) {
            if (error?.response?.status !== 404) {
                throw error;
            }
        }
    }

    async saveJSON(file: string, content: any) {
        return this.saveFile(file, JSON.stringify(content, null, 4));
    }

    async copy(src: string, dst: string) {
        const srcData = await this.read(src);
        if (srcData) {
            this.saveFile(dst, srcData.toString());
        }
    }

    async copyBlob(src: string, dst: string) {
        const srcData = await this.blob(src);
        if (srcData) {
            await this.saveBlob(dst, srcData);
        }
    }

    async repos() {
        const { data } = await this.call({
            url: `${BASE_URL}/users/${this.user}/repos?sort=updated&per_page=1000`,
        });
        return data.map(({ name }: any) => name) as string[];
    }

    async getRepo() {
        return this.repo;
    }

    async info() {
        const {
            data: {
                rate: { limit, remaining },
            },
        } = await this.call({
            url: `${BASE_URL}/rate_limit`,
        });
        return `For GitHub API requests, you can make up to 5000 requests per hour.
        Every pages of the test-crawler UI is using multiples request at once. Your
        current rate limit is: ${remaining} of ${limit}`;
    }

    protected call(config: AxiosRequestConfig) {
        if (!this.token || !this.user) {
            throw new Error(ERR.missingGitHubConfig);
        }
        return axios({
            ...config,
            headers: {
                ...config?.headers,
                Authorization: `token ${this.token}`,
            },
        });
    }

    protected getContents(path: string) {
        return this.call({
            url: `${this.contentsUrl}/${path}`,
        });
    }

    protected get baseRepo() {
        return `${BASE_URL}/repos/${this.user}/${this.repo}`;
    }

    protected get contentsUrl() {
        return `${this.baseRepo}/contents`;
    }

    protected get blobUrl() {
        return `${this.baseRepo}/git/blobs`;
    }

    protected get ciDispatchUrl() {
        return `${this.baseRepo}/dispatches`;
    }

    protected get runsUrl() {
        return `${this.baseRepo}/actions/workflows/test-crawler.yml/runs?event=repository_dispatch`;
    }

    protected get redirectUrl() {
        return `https://github.com/${this.user}/${this.repo}/actions`;
    }

    protected get user() {
        return getGithubUser();
    }

    protected get token() {
        return getGithubToken();
    }

    protected get repo() {
        return getGithubRepo();
    }
}
