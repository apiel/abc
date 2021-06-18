import { GitHubStorage } from './storage/GitHubStorage';

const gitHubStorage = new GitHubStorage();

const file = 'data.yo';

export async function loadData() {
    const data = await gitHubStorage.read(file);
    // if (sequences && Array.isArray(sequences)) {
    //     setSequences(sequences);
    // }
}

export function saveData() {
    return gitHubStorage.saveFile(file, 'some stuff to save');
}
