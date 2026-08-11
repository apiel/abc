import { elById, inputById } from '../utils/dom';
import { calculatePasswordStrength, generatePassword } from '../utils/generator';
import { showToast } from '../utils/toast';

export function initGeneratorManager() {
    const genBtn = elById('btn-generator');
    const modal = elById('generator-modal');
    const closeBtn = elById('btn-close-gen-modal');
    const refreshBtn = elById('btn-refresh-gen');
    const copyBtn = elById('btn-copy-gen');

    const lengthSlider = inputById('gen-length');
    const lengthValSpan = elById('gen-length-val');

    const upperCheck = inputById('gen-upper');
    const lowerCheck = inputById('gen-lower');
    const digitsCheck = inputById('gen-digits');
    const symbolsCheck = inputById('gen-symbols');

    function updateGeneratedPassword() {
        const length = parseInt(lengthSlider?.value || '16', 10);
        if (lengthValSpan) lengthValSpan.innerText = length.toString();

        const pass = generatePassword({
            length,
            useUpper: upperCheck?.checked ?? true,
            useLower: lowerCheck?.checked ?? true,
            useDigits: digitsCheck?.checked ?? true,
            useSymbols: symbolsCheck?.checked ?? true,
        });

        const outputInput = inputById('gen-output');
        if (outputInput) outputInput.value = pass;

        const strength = calculatePasswordStrength(pass);
        const strengthBar = elById('strength-bar');
        if (strengthBar) {
            strengthBar.className = `strength-bar ${strength}`;
        }
    }

    if (genBtn && modal) {
        genBtn.onclick = () => {
            modal.classList.remove('hide');
            updateGeneratedPassword();
        };
    }

    if (closeBtn && modal) {
        closeBtn.onclick = () => modal.classList.add('hide');
    }

    [lengthSlider, upperCheck, lowerCheck, digitsCheck, symbolsCheck].forEach((input) => {
        if (input) {
            input.oninput = () => updateGeneratedPassword();
            input.onchange = () => updateGeneratedPassword();
        }
    });

    if (refreshBtn) {
        refreshBtn.onclick = () => updateGeneratedPassword();
    }

    if (copyBtn) {
        copyBtn.onclick = () => {
            const pass = inputById('gen-output')?.value;
            if (pass) {
                navigator.clipboard.writeText(pass);
                showToast('Copied generated password!');
            }
        };
    }
}
