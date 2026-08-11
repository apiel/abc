import { React as fix, ElementNode } from 'async-jsx-html';

const React = fix;

export function VaultView(): ElementNode {
    return (
        <div class="container">
            {/* Toolbar */}
            <div class="toolbar">
                <div class="search-box">
                    <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input id="search-input" type="text" class="search-input" placeholder="Filter lines or search keywords..." />
                </div>

                <div class="toolbar-actions" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button id="btn-toggle-edit" class="btn">
                        ✏️ Edit Plain Text
                    </button>
                    <button id="btn-save-interactive" class="btn btn-primary">
                        💾 Save to GitHub
                    </button>
                </div>
            </div>

            {/* Interactive Plain Text View */}
            <div id="interactive-view" class="interactive-container">
                <div id="plain-text-lines" class="plain-text-lines">
                    {/* Dynamically populated line rows */}
                </div>
            </div>

            {/* Raw Textarea Editor Mode */}
            <div id="raw-editor-mode" class="raw-editor-container hide">
                <textarea id="content" class="raw-textarea" placeholder="github user@gmail.com mySecretPass123!
google me@gmail.com anotherPass456
- Just a plain text note line
# Comment line where words are copiable"></textarea>
            </div>

            {/* Generator Modal */}
            <div id="generator-modal" class="modal-overlay hide">
                <div class="modal-card">
                    <div class="modal-header">
                        <h3 class="modal-title">Password Generator</h3>
                        <button id="btn-close-gen-modal" class="btn btn-icon">✕</button>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input id="gen-output" type="text" class="form-input" readonly style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 600, color: '#10b981' }} />
                            <button id="btn-copy-gen" class="btn btn-primary">Copy</button>
                        </div>
                        <div class="strength-meter">
                            <div id="strength-bar" class="strength-bar strong"></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label class="form-label">Length: <span id="gen-length-val">16</span> characters</label>
                        </div>
                        <input id="gen-length" type="range" min="8" max="64" value="16" style={{ width: '100%' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                        <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input id="gen-upper" type="checkbox" checked /> Uppercase (A-Z)
                        </label>
                        <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input id="gen-lower" type="checkbox" checked /> Lowercase (a-z)
                        </label>
                        <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input id="gen-digits" type="checkbox" checked /> Numbers (0-9)
                        </label>
                        <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input id="gen-symbols" type="checkbox" checked /> Symbols (!@#$)
                        </label>
                    </div>

                    <div class="modal-footer">
                        <button id="btn-refresh-gen" class="btn" style={{ width: '100%' }}>Regenerate Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
