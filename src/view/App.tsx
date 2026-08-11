import { React as fix, ElementNode } from 'async-jsx-html';
import { Navbar } from './Navbar';
import { Settings } from './Settings/Settings';
import { UnlockModal } from './UnlockModal';
import { VaultView } from './VaultView';

const React = fix;

export function App(): ElementNode {
    return (
        <>
            <Navbar />
            <VaultView />
            <UnlockModal />
            <Settings />
            <div id="toast-container" class="toast-container"></div>
        </>
    );
}
