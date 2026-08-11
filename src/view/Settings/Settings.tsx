import { React as fix, ElementNode } from 'async-jsx-html';
import {
    getGithubRepo,
    getGithubToken,
    getGithubUser,
    getMasterSecret,
    getSessionPin,
} from '../../storage/localStorage';

const React = fix;

export function Settings(): ElementNode {
    return (
        <div id="settings-modal" class="modal-overlay hide">
            <div class="modal-card" style={{ maxWidth: '520px' }}>
                <div class="modal-header">
                    <h3 class="modal-title">Application & Storage Settings</h3>
                    <button id="btn-close-settings" class="btn btn-icon">✕</button>
                </div>

                <form id="form-settings" onSubmit="return false;">
                    <div style={{ marginBottom: '1.25rem' }}>
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                            1. GitHub Storage Setup
                        </h4>
                        
                        <div class="form-group">
                            <label class="form-label">GitHub Username</label>
                            <input
                                id="githubUser"
                                type="text"
                                class="form-input"
                                value={getGithubUser()}
                                placeholder="e.g. apiel"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">GitHub Repository Name</label>
                            <input
                                id="githubRepo"
                                type="text"
                                class="form-input"
                                value={getGithubRepo()}
                                placeholder="e.g. abc"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">GitHub Personal Access Token (PAT)</label>
                            <input
                                id="githubToken"
                                type="password"
                                class="form-input"
                                value={getGithubToken()}
                                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                            2. Cryptography Keys
                        </h4>

                        <div class="form-group">
                            <label class="form-label">Master Secret (Encrypts data2.yo on GitHub)</label>
                            <input
                                id="masterSecret"
                                type="password"
                                class="form-input"
                                value={getMasterSecret()}
                                placeholder="Strong secret key"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Simple Local PIN (Unlocks local device)</label>
                            <input
                                id="localPin"
                                type="password"
                                class="form-input"
                                value={getSessionPin()}
                                placeholder="Simple device PIN / password"
                                required
                            />
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" id="btn-cancel-settings" class="btn">Cancel</button>
                        <button type="submit" id="btn-save-settings" class="btn btn-primary">
                            Save & Encrypt Config
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
