import crypto from 'crypto-js';
import { getSecret } from './localStorage';

const secret = prompt('Secret');

export function encrypt(text: string) {
    return crypto.AES.encrypt(text, secret).toString();
}

export function decrypt(text: string) {
    return crypto.AES.decrypt(text, secret).toString(
        crypto.enc.Utf8,
    );
}

function getStrongSecret() {
    const strongSecret = getSecret();
    if (!strongSecret) {
        throw new Error('No strong secret!!!');
    }
    return strongSecret;
}

export function strongEncrypt(text: string) {
    return crypto.AES.encrypt(text, getStrongSecret()).toString();
}

export function strongDecrypt(text: string) {
    return crypto.AES.decrypt(text, getStrongSecret()).toString(
        crypto.enc.Utf8,
    );
}
