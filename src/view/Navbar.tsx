import { React as fix, ElementNode } from 'async-jsx-html';
import { SettingOutline } from '../icons/setting-outline';

const React = fix;

export function Navbar(): ElementNode {
    return (
        <nav class="navbar">
            <div class="brand">
                <div class="brand-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <span class="badge-v2">v2 • AES-GCM</span>
            </div>

            <div class="nav-actions">
                <div id="status-pill" class="status-pill">
                    <span id="status-dot" class="status-dot"></span>
                    <span id="status-text" class="status-text-label">Checking GitHub...</span>
                </div>

                <button id="btn-generator" class="btn" title="Password Generator">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                    </svg>
                    <span class="btn-text">Generator</span>
                </button>

                <button id="toggle-settings" class="btn btn-icon" title="Settings">
                    <SettingOutline style={{ width: '20px', height: '20px' }} />
                </button>
            </div>
        </nav>
    );
}
