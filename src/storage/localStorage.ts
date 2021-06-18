import { encrypt, decrypt } from './crypt';

interface StorageData {
    githubUser: string;
    githubToken: string;
    githubRepo: string;
    secret: string;
}

function store(data: StorageData) {
    try {
        window.localStorage.setItem('data', encrypt(JSON.stringify(data)));
    } catch (error) {
        console.error(error);
    }
}

function get(): StorageData {
    try {
        return JSON.parse(decrypt(window.localStorage.getItem('data')));
    } catch (error) {
        console.error(error);
    }
}

export function getGithubUser() {
    return get()?.githubUser || '';
}

export function getGithubRepo() {
    return get()?.githubRepo || '';
}

export function getGithubToken() {
    return get()?.githubToken || '';
}

export function getSecret() {
    return get()?.secret || '';
}

function storeItem(key: keyof StorageData, val: string) {
    const data = get() || ({} as StorageData);
    data[key] = val;
    store(data);
}

export function storeGithubUser(val: string) {
    storeItem('githubUser', val);
}

export function storeGithubRepo(val: string) {
    storeItem('githubRepo', val);
}

export function storeGithubToken(val: string) {
    storeItem('githubToken', val);
}

export function storeSecret(val: string) {
    storeItem('secret', val);
}
