import { emitSetData } from './event';
import { strongDecrypt, strongEncrypt } from './storage/crypt';
import { GitHubStorage } from './storage/GitHubStorage';

const gitHubStorage = new GitHubStorage();

const file = 'data.yo';

let data: string;

export async function loadData() {
    const temp = (await gitHubStorage.read(file))?.toString();
    if (temp) {
        data = strongDecrypt(temp);
        emitSetData(data);
    }
}

export function saveData(newData: string) {
    data = newData;
    // emitSetData(data); ??
    return gitHubStorage.saveFile(file, strongEncrypt(data));
}
