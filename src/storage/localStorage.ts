import { strongDecryptV2, strongEncryptV2 } from './crypt';

export interface StorageDataV2 {
    githubUser: string;
    githubToken: string;
    githubRepo: string;
    masterSecret: string;
}

const STORAGE_KEY_V2 = 'data_v2';
let sessionPin: string | null = null;
let cachedConfig: StorageDataV2 | null = null;

export function isSessionUnlocked(): boolean {
    return cachedConfig !== null && sessionPin !== null;
}

export function hasStoredConfig(): boolean {
    return !!window.localStorage.getItem(STORAGE_KEY_V2);
}

export async function unlockSession(pin: string): Promise<boolean> {
    const raw = window.localStorage.getItem(STORAGE_KEY_V2);
    if (!raw) {
        sessionPin = pin;
        cachedConfig = {
            githubUser: '',
            githubToken: '',
            githubRepo: '',
            masterSecret: '',
        };
        return true;
    }
    try {
        const decrypted = await strongDecryptV2(raw, pin);
        if (decrypted) {
            cachedConfig = JSON.parse(decrypted);
            sessionPin = pin;
            return true;
        }
    } catch (e) {
        console.error('Failed to unlock session:', e);
    }
    return false;
}

export function lockSession(): void {
    sessionPin = null;
    cachedConfig = null;
}

export async function saveV2Config(config: StorageDataV2, pin?: string): Promise<void> {
    const targetPin = pin || sessionPin;
    if (!targetPin) {
        throw new Error('Local PIN is required to encrypt storage configuration.');
    }
    cachedConfig = { ...config };
    sessionPin = targetPin;
    const encrypted = await strongEncryptV2(JSON.stringify(config), targetPin);
    window.localStorage.setItem(STORAGE_KEY_V2, encrypted);
}

export function getGithubUser(): string {
    return cachedConfig?.githubUser || '';
}

export function getGithubRepo(): string {
    return cachedConfig?.githubRepo || '';
}

export function getGithubToken(): string {
    return cachedConfig?.githubToken || '';
}

export function getMasterSecret(): string {
    return cachedConfig?.masterSecret || '';
}

export function getSessionPin(): string {
    return sessionPin || '';
}
