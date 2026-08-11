import { loadData } from '../git';
import { hasStoredConfig, isSessionUnlocked, lockSession, unlockSession } from '../storage/localStorage';
import { elById, inputById } from '../utils/dom';
import { showToast } from '../utils/toast';
import { initGeneratorManager } from './generatorManager';
import { initSettings, updateStatusPill } from './Settings/settings';
import { initVaultManager } from './vaultManager';

export function initApp() {
    initSettings();
    initVaultManager();
    initGeneratorManager();

    const unlockModal = elById('unlock-modal');
    const formUnlock = elById('form-unlock');
    const unlockError = elById('unlock-error');
    const btnUnlockConfigure = elById('btn-unlock-configure');

    const handleUnlockSuccess = async () => {
        if (unlockModal) unlockModal.classList.add('hide');
        updateStatusPill('Syncing data2.yo...', true);
        try {
            await loadData();
            updateStatusPill('Synced (data2.yo)', true);
        } catch (err: any) {
            updateStatusPill('Sync error', false);
            showToast(`Sync error: ${err?.message || err}`, true);
        }
    };

    // Check startup state
    if (hasStoredConfig()) {
        if (unlockModal) unlockModal.classList.remove('hide');
        updateStatusPill('Vault Locked', false);
    } else {
        // No stored configuration -> open Settings for first time setup
        const settingsModal = elById('settings-modal');
        if (settingsModal) settingsModal.classList.remove('hide');
        updateStatusPill('Setup Required', false);
    }

    if (formUnlock) {
        formUnlock.onsubmit = async (e) => {
            e.preventDefault();
            const pin = inputById('unlock-pin')?.value || '';
            if (!pin) return;

            const success = await unlockSession(pin);
            if (success) {
                if (unlockError) unlockError.style.display = 'none';
                inputById('unlock-pin').value = '';
                await handleUnlockSuccess();
                showToast('Vault unlocked!');
            } else {
                if (unlockError) unlockError.style.display = 'block';
            }
        };
    }

    if (btnUnlockConfigure) {
        btnUnlockConfigure.onclick = () => {
            if (unlockModal) unlockModal.classList.add('hide');
            const settingsModal = elById('settings-modal');
            if (settingsModal) settingsModal.classList.remove('hide');
        };
    }
}
