import { emitMigrationAvailable, emitSetData } from './event';
import { decryptLegacyCryptoJS, strongDecryptV2, strongEncryptV2 } from './storage/crypt';
import { GitHubStorage } from './storage/GitHubStorage';
import { getMasterSecret } from './storage/localStorage';

const gitHubStorage = new GitHubStorage();

export const FILE_V1 = 'data.yo';
export const FILE_V2 = 'data2.yo';

let cachedVaultData: string = '';

export function getCachedVaultData(): string {
    return cachedVaultData;
}

export async function loadData(): Promise<string> {
    const masterSecret = getMasterSecret();
    if (!masterSecret) {
        throw new Error('Master secret is not set.');
    }

    try {
        const v2Content = (await gitHubStorage.read(FILE_V2))?.toString();
        if (v2Content && v2Content.trim()) {
            cachedVaultData = await strongDecryptV2(v2Content, masterSecret);
            emitSetData(cachedVaultData);
            return cachedVaultData;
        }
    } catch (err) {
        console.warn('V2 file load check:', err);
    }

    // Check if legacy data.yo exists on GitHub
    try {
        const v1Content = (await gitHubStorage.read(FILE_V1))?.toString();
        if (v1Content && v1Content.trim()) {
            emitMigrationAvailable(v1Content);
        }
    } catch (err) {
        console.log('No legacy v1 file found.');
    }

    return '';
}

export async function saveData(newData: string): Promise<void> {
    const masterSecret = getMasterSecret();
    if (!masterSecret) {
        throw new Error('Master secret is required to save data.');
    }

    cachedVaultData = newData;
    const encryptedV2 = await strongEncryptV2(newData, masterSecret);
    await gitHubStorage.saveFile(FILE_V2, encryptedV2);
    emitSetData(cachedVaultData);
}

export async function migrateV1ToV2(v1RawContent: string): Promise<string> {
    const masterSecret = getMasterSecret();
    if (!masterSecret) {
        throw new Error('Master secret is required for migration.');
    }

    let decryptedText = '';
    try {
        decryptedText = await strongDecryptV2(v1RawContent, masterSecret);
    } catch (e) {
        decryptedText = decryptLegacyCryptoJS(v1RawContent, masterSecret);
    }

    if (!decryptedText) {
        throw new Error('Could not decrypt legacy data.yo. Please check master secret.');
    }

    await saveData(decryptedText);
    return decryptedText;
}
