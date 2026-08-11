import { React as fix, ElementNode } from 'async-jsx-html';

const React = fix;

export function UnlockModal(): ElementNode {
    return (
        <div id="unlock-modal" class="modal-overlay hide">
            <div class="modal-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ margin: '0 auto 1rem', width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <h3 class="modal-title" style={{ marginBottom: '0.5rem' }}>Trusted Device Locked</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    Enter your simple local PIN/Password to unlock storage.
                </p>

                <form id="form-unlock" onSubmit="return false;">
                    <div class="form-group">
                        <input
                            id="unlock-pin"
                            type="password"
                            class="form-input"
                            placeholder="Enter local PIN / Password"
                            autocomplete="current-password"
                            autofocus
                        />
                    </div>
                    <div id="unlock-error" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: '1rem', display: 'none' }}>
                        Incorrect PIN. Please try again.
                    </div>
                    <button type="submit" id="btn-submit-unlock" class="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                        Unlock Vault
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <button id="btn-unlock-configure" class="btn" style={{ fontSize: '0.8rem', border: 'none', background: 'transparent', color: 'var(--text-dim)' }}>
                        First time or lost PIN? Configure Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
