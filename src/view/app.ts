import { loadData } from '../git';
import { hasStoredConfig, isSessionUnlocked, lockSession, unlockSession } from '../storage/localStorage';
import { elById, inputById } from '../utils/dom';
import { showToast } from '../utils/toast';
import { initGeneratorManager } from './generatorManager';
import { initSettings, updateStatusPill } from './Settings/settings';
import { initVaultManager } from './vaultManager';

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
let autoLockTimer: ReturnType<typeof setTimeout> | null = null;
let lastActivityTime = Date.now();

export function performAutoLock() {
    if (!isSessionUnlocked()) return;

    lockSession();

    if (autoLockTimer) {
        clearTimeout(autoLockTimer);
        autoLockTimer = null;
    }

    const unlockModal = elById('unlock-modal');
    if (unlockModal) unlockModal.classList.remove('hide');

    const generatorModal = elById('generator-modal');
    if (generatorModal) generatorModal.classList.add('hide');

    const settingsModal = elById('settings-modal');
    if (settingsModal) settingsModal.classList.add('hide');

    updateStatusPill('Vault Locked', false);
    showToast('Vault auto-locked after 5 minutes of inactivity.', true);
}

export function resetInactivityTimer() {
    lastActivityTime = Date.now();

    if (autoLockTimer) {
        clearTimeout(autoLockTimer);
        autoLockTimer = null;
    }

    if (!isSessionUnlocked()) return;

    autoLockTimer = setTimeout(() => {
        performAutoLock();
    }, INACTIVITY_TIMEOUT_MS);
}

function initInactivityMonitor() {
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    
    activityEvents.forEach((evtName) => {
        window.addEventListener(evtName, () => {
            if (isSessionUnlocked()) {
                resetInactivityTimer();
            }
        }, { passive: true });
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && isSessionUnlocked()) {
            const elapsed = Date.now() - lastActivityTime;
            if (elapsed >= INACTIVITY_TIMEOUT_MS) {
                performAutoLock();
            } else {
                resetInactivityTimer();
            }
        }
    });
}

export function initApp() {
    initSettings();
    initVaultManager();
    initGeneratorManager();
    initInactivityMonitor();

    const unlockModal = elById('unlock-modal');
    const formUnlock = elById('form-unlock');
    const unlockError = elById('unlock-error');
    const btnUnlockConfigure = elById('btn-unlock-configure');

    const handleUnlockSuccess = async () => {
        if (unlockModal) unlockModal.classList.add('hide');
        resetInactivityTimer();
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
