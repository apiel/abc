import { loadData } from '../../git';
import { saveV2Config } from '../../storage/localStorage';
import { elById, inputById } from '../../utils/dom';
import { showToast } from '../../utils/toast';

export function initSettings() {
    const settingsModal = elById('settings-modal');
    const toggleBtn = elById('toggle-settings');
    const closeBtn = elById('btn-close-settings');
    const cancelBtn = elById('btn-cancel-settings');
    const formSettings = elById('form-settings');

    const openSettings = () => {
        if (settingsModal) settingsModal.classList.remove('hide');
    };

    const closeSettings = () => {
        if (settingsModal) settingsModal.classList.add('hide');
    };

    if (toggleBtn) toggleBtn.onclick = openSettings;
    if (closeBtn) closeBtn.onclick = closeSettings;
    if (cancelBtn) cancelBtn.onclick = closeSettings;

    if (formSettings) {
        formSettings.onsubmit = async (e) => {
            e.preventDefault();
            const githubUser = inputById('githubUser').value.trim();
            const githubRepo = inputById('githubRepo').value.trim();
            const githubToken = inputById('githubToken').value.trim();
            const masterSecret = inputById('masterSecret').value.trim();
            const localPin = inputById('localPin').value.trim();

            if (!githubUser || !githubRepo || !githubToken || !masterSecret || !localPin) {
                showToast('All settings fields are required.', true);
                return;
            }

            try {
                await saveV2Config(
                    {
                        githubUser,
                        githubRepo,
                        githubToken,
                        masterSecret,
                    },
                    localPin
                );

                closeSettings();
                showToast('Configuration encrypted & saved to device!');
                
                // Update status indicator & trigger GitHub sync
                updateStatusPill('Connected to GitHub', true);
                await loadData();
            } catch (err: any) {
                showToast(`Settings error: ${err?.message || err}`, true);
            }
        };
    }
}

export function updateStatusPill(text: string, isOk: boolean) {
    const statusText = elById('status-text');
    const statusDot = elById('status-dot');
    if (statusText) statusText.innerText = text;
    if (statusDot) {
        if (isOk) statusDot.classList.add('active');
        else statusDot.classList.remove('active');
    }
}
