import { React as fix, ElementNode } from 'async-jsx-html';
import { SettingOutline } from '../../icons/setting-outline';
import {
    getGithubRepo,
    getGithubToken,
    getGithubUser,
    getSecret,
} from '../../storage/localStorage';

const React = fix;

export function Settings(): ElementNode {
    return (
        <>
            <div id="settings" class="hide">
                <div>
                    <input
                        id="githubUser"
                        value={getGithubUser()}
                        placeholder="Enter github user"
                    />
                </div>
                <div>
                    <input
                        id="githubRepo"
                        value={getGithubRepo()}
                        placeholder="Enter github repo"
                    />
                </div>
                <div>
                    <input
                        id="githubToken"
                        type="password"
                        value={getGithubToken()}
                        placeholder="Enter github token"
                    />
                </div>
                <div>
                    <input
                        id="secret"
                        type="password"
                        value={getSecret()}
                        placeholder="Enter secret"
                    />
                </div>
            </div>
            <a id="toggle-settings"><SettingOutline /></a>
        </>
    );
}
