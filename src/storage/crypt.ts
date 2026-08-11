import cryptoJs from 'crypto-js';

export interface EncryptedPayload {
    version: number;
    salt: string;
    iv: string;
    ciphertext: string;
}

function bufferToBase64(buf: ArrayBuffer | Uint8Array): string {
    const bytes = new Uint8Array(buf);
    let binString = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binString += String.fromCharCode(bytes[i]);
    }
    return btoa(binString);
}

function base64ToBuffer(b64: string): Uint8Array {
    const binString = atob(b64);
    const bytes = new Uint8Array(binString.length);
    for (let i = 0; i < binString.length; i++) {
        bytes[i] = binString.charCodeAt(i);
    }
    return bytes;
}

async function deriveAESGCMKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(passphrase),
        'PBKDF2',
        false,
        ['deriveKey']
    );
    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 600000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

export async function strongEncryptV2(text: string, secret: string): Promise<string> {
    if (!secret) {
        throw new Error('Master secret is required for encryption.');
    }
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveAESGCMKey(secret, salt);
    const encoder = new TextEncoder();
    const encryptedBuf = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encoder.encode(text)
    );
    const payload: EncryptedPayload = {
        version: 2,
        salt: bufferToBase64(salt),
        iv: bufferToBase64(iv),
        ciphertext: bufferToBase64(encryptedBuf),
    };
    return JSON.stringify(payload, null, 2);
}

export async function strongDecryptV2(rawContent: string, secret: string): Promise<string> {
    if (!rawContent || !rawContent.trim()) {
        return '';
    }
    if (!secret) {
        throw new Error('Master secret is required for decryption.');
    }

    try {
        const payload: EncryptedPayload = JSON.parse(rawContent);
        if (payload && payload.version === 2 && payload.salt && payload.iv && payload.ciphertext) {
            const salt = base64ToBuffer(payload.salt);
            const iv = base64ToBuffer(payload.iv);
            const ciphertext = base64ToBuffer(payload.ciphertext);
            const key = await deriveAESGCMKey(secret, salt);
            const decryptedBuf = await window.crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                ciphertext
            );
            const decoder = new TextDecoder();
            return decoder.decode(decryptedBuf);
        }
    } catch (e) {
        // Not a JSON V2 payload, fallback to legacy
    }

    return decryptLegacyCryptoJS(rawContent, secret);
}

export function decryptLegacyCryptoJS(ciphertext: string, secret: string): string {
    if (!ciphertext || !ciphertext.trim()) return '';
    try {
        const bytes = cryptoJs.AES.decrypt(ciphertext, secret);
        const decrypted = bytes.toString(cryptoJs.enc.Utf8);
        if (!decrypted) {
            throw new Error('Invalid secret or format');
        }
        return decrypted;
    } catch (err) {
        throw new Error('Legacy decryption failed. Check your secret.');
    }
}
