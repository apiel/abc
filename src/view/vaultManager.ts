import { onSetData } from '../event';
import { saveData } from '../git';
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

    // Save Handlers (Both Top Toolbar button and Textarea Save button)
    const handleSave = async () => {
        try {
            if (isEditingMode) {
                rawTextData = inputById('content').value;
            }
            await saveData(rawTextData);
            renderPlainTextLines();
            showToast('Saved to GitHub (data2.yo)!');
        } catch (err: any) {
            showToast(`Save failed: ${err?.message || err}`, true);
        }
    };

    const saveContentBtn = elById('save-content');
    if (saveContentBtn) saveContentBtn.onclick = handleSave;

    const saveInteractiveBtn = elById('btn-save-interactive');
    if (saveInteractiveBtn) saveInteractiveBtn.onclick = handleSave;
}

export function renderPlainTextLines() {
    const linesContainer = elById('plain-text-lines');

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

            // Rule 1: Dash lines starting with "-" -> Pure plain text line, no formatting, no chips
            if (line.startsWith('-')) {
                return `
                    <div class="line-row dash-plain-line" data-line-index="${index}">
                        <span class="dash-text-content">${escapeHtml(line)}</span>
                    </div>
                `;
            }

            // Rule 2: Comment lines starting with "#" -> Comment line, no title badge formatting, but each word is clickable
            if (line.startsWith('#')) {
                const words = line.split(/\s+/);
                return `
                    <div class="line-row comment-line-row" data-line-index="${index}">
                        <div class="line-words-group">
                            ${words.map((w) => `
                                <button class="clickable-word-chip comment-word-chip" data-word="${escapeHtml(w)}" title="Click to copy">
                                    ${escapeHtml(w)}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // Rule 3: Standard line -> First word is HIGHLIGHTED Title Badge (and copiable), rest are word chips
            const words = line.split(/\s+/);
            const titleWord = words[0] || '';
            const remainingWords = words.slice(1);

            return `
                <div class="line-row" data-line-index="${index}">
                    <button class="line-title-badge clickable-word-chip" data-word="${escapeHtml(titleWord)}" title="Click to copy title">
                        <span class="title-text">${escapeHtml(titleWord)}</span>
                    </button>

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

    // Attach click-to-copy event listeners to all word chips (including title)
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
