export interface GeneratorOptions {
    length: number;
    useUpper: boolean;
    useLower: boolean;
    useDigits: boolean;
    useSymbols: boolean;
}

export function generatePassword(options: GeneratorOptions): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charPool = '';
    let mandatoryChars = '';

    if (options.useUpper) {
        charPool += uppercase;
        mandatoryChars += getRandomChar(uppercase);
    }
    if (options.useLower) {
        charPool += lowercase;
        mandatoryChars += getRandomChar(lowercase);
    }
    if (options.useDigits) {
        charPool += digits;
        mandatoryChars += getRandomChar(digits);
    }
    if (options.useSymbols) {
        charPool += symbols;
        mandatoryChars += getRandomChar(symbols);
    }

    if (!charPool) {
        charPool = lowercase + digits;
    }

    let result = mandatoryChars;
    const remainingLength = Math.max(0, options.length - mandatoryChars.length);

    const randomValues = new Uint32Array(remainingLength);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < remainingLength; i++) {
        result += charPool[randomValues[i] % charPool.length];
    }

    // Shuffle result
    return result
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('');
}

function getRandomChar(str: string): string {
    const rand = new Uint32Array(1);
    window.crypto.getRandomValues(rand);
    return str[rand[0] % str.length];
}

export function calculatePasswordStrength(pass: string): 'weak' | 'medium' | 'strong' {
    if (!pass) return 'weak';
    let score = 0;
    if (pass.length >= 12) score += 2;
    else if (pass.length >= 8) score += 1;

    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score >= 5) return 'strong';
    if (score >= 3) return 'medium';
    return 'weak';
}
