import { onMigrationAvailable, onSetData } from '../event';
import { migrateV1ToV2, saveData } from '../git';
import { elById, inputById } from '../utils/dom';
import { showToast } from '../utils/toast';

let rawTextData: string = '';
let searchQuery: string = '';
let isEditingMode: boolean = false;

export function initVaultManager() {
    // Listen for data updates from GitHub
    onSetData((dataString: string) => {
        rawTextData = dataString || '';
        const contentArea = inputById('content');
        if (contentArea) {
            contentArea.value = rawTextData;
        }
        renderPlainTextLines();
    });

    // Migration notification
    onMigrationAvailable((v1Content: string) => {
        const migrationBanner = elById('migration-banner');
        if (migrationBanner) {
            migrationBanner.classList.remove('hide');
        }

        const runMigrationBtn = elById('btn-run-migration');
        if (runMigrationBtn) {
            runMigrationBtn.onclick = async () => {
                try {
                    runMigrationBtn.innerText = 'Migrating...';
                    await migrateV1ToV2(v1Content);
                    migrationBanner.classList.add('hide');
                    showToast('Successfully migrated data.yo to data2.yo using AES-GCM!');
                } catch (err: any) {
                    showToast(`Migration error: ${err?.message || err}`, true);
                    runMigrationBtn.innerText = 'Import to data2.yo';
                }
            };
        }
    });

    // Search filter input
    const searchInput = inputById('search-input');
    if (searchInput) {
        searchInput.oninput = (e) => {
            searchQuery = (e.target as HTMLInputElement).value.toLowerCase();
            renderPlainTextLines();
        };
    }

    // Toggle Edit / Interactive View
    const toggleEditBtn = elById('btn-toggle-edit');
    const saveInteractiveBtn = elById('btn-save-interactive');
    const interactiveView = elById('interactive-view');
    const rawEditorMode = elById('raw-editor-mode');

    if (toggleEditBtn && interactiveView && rawEditorMode) {
        toggleEditBtn.onclick = () => {
            isEditingMode = !isEditingMode;
            if (isEditingMode) {
                // Switch to Raw Textarea Edit Mode
                interactiveView.classList.add('hide');
                rawEditorMode.classList.remove('hide');
                toggleEditBtn.innerText = '👁️ Interactive View';
                if (saveInteractiveBtn) saveInteractiveBtn.classList.add('hide');
            } else {
                // Switch back to Interactive View
                rawTextData = inputById('content').value;
                rawEditorMode.classList.add('hide');
                interactiveView.classList.remove('hide');
                toggleEditBtn.innerText = '✏️ Edit Plain Text';
                renderPlainTextLines();
            }
        };
    }

    // Save Raw Text Mode
    const saveContentBtn = elById('save-content');
    if (saveContentBtn) {
        saveContentBtn.onclick = async () => {
            try {
                rawTextData = inputById('content').value;
                await saveData(rawTextData);
                renderPlainTextLines();
                showToast('Saved to GitHub (data2.yo)!');
            } catch (err: any) {
                showToast(`Save failed: ${err?.message || err}`, true);
            }
        };
    }
}

export function renderPlainTextLines() {
    const linesContainer = elById('plain-text-lines');
    const lineCountBadge = elById('line-count-badge');
    if (!linesContainer) return;

    const allLines = rawTextData.split('\n');
    let displayLinesCount = 0;

    const renderedHtml = allLines
        .map((lineRaw, index) => {
            const line = lineRaw.trim();
            if (!line) return '';

            if (searchQuery && !line.toLowerCase().includes(searchQuery)) {
                return '';
            }

            displayLinesCount++;
            const words = line.split(/\s+/);
            const titleWord = words[0] || '';
            const remainingWords = words.slice(1);

            return `
                <div class="line-row" data-line-index="${index}">
                    <div class="line-title-badge" title="Title (First word)">
                        <span class="title-text">${escapeHtml(titleWord)}</span>
                    </div>

                    <div class="line-words-group">
                        ${remainingWords.length > 0 ? remainingWords
                            .map((w) => `
                                <button class="clickable-word-chip" data-word="${escapeHtml(w)}" title="Click to copy word">
                                    ${escapeHtml(w)}
                                </button>
                            `)
                            .join('') : '<span style="color: var(--text-dim); font-size: 0.8rem; font-style: italic;">(no extra words)</span>'}
                    </div>
                </div>
            `;
        })
        .filter((html) => html !== '')
        .join('');

    if (lineCountBadge) {
        lineCountBadge.innerText = `${displayLinesCount} line${displayLinesCount === 1 ? '' : 's'}`;
    }

    if (!renderedHtml) {
        linesContainer.innerHTML = `
            <div style="text-align: center; padding: 4rem 1rem; color: var(--text-dim);">
                <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">📝</div>
                <h4 style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 0.5rem;">No Text Lines Found</h4>
                <p style="font-size: 0.875rem;">Click "Edit Plain Text" above to type or paste your password lines.</p>
            </div>
        `;
        return;
    }

    linesContainer.innerHTML = renderedHtml;

    // Attach click-to-copy event listeners to word chips
    linesContainer.querySelectorAll('.clickable-word-chip').forEach((chip) => {
        chip.addEventListener('click', (e) => {
            const btn = e.currentTarget as HTMLElement;
            const word = btn.getAttribute('data-word') || '';
            if (word) {
                navigator.clipboard.writeText(word);
                
                // Visual click feedback
                btn.classList.add('copied-flash');
                setTimeout(() => btn.classList.remove('copied-flash'), 400);

                showToast(`Copied "${word}" to clipboard!`);
            }
        });
    });
}

function escapeHtml(str: string): string {
    return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
