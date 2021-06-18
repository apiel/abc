import crypto from 'crypto-js';

const secret = prompt('Secret');

export function encrypt(text: string) {
    return crypto.AES.encrypt(text, secret).toString();
}

export function decrypt(text: string) {
    return crypto.AES.decrypt(text, secret).toString(
        crypto.enc.Utf8,
    );
}
