import {
    storeGithubRepo,
    storeGithubToken,
    storeGithubUser,
    storeSecret,
} from '../../storage/localStorage';
import { elById, evStrVal } from '../../utils/dom';

export function initSettings() {
    elById('githubUser').onchange = evStrVal(storeGithubUser);
    elById('githubRepo').onchange = evStrVal(storeGithubRepo);
    elById('githubToken').onchange = evStrVal(storeGithubToken);
    elById('secret').onchange = evStrVal(storeSecret);
    elById('toggle-settings').onclick = () => elById('settings').classList.toggle('hide');
}
