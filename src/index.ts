import { loadData } from './git';
import { initApp } from './view/app';
import { App } from './view/App';

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('./sw.js')
            .then((reg) => console.log('PassVault V2 PWA ServiceWorker registered:', reg.scope))
            .catch((err) => console.warn('ServiceWorker registration failed:', err));
    });
}

// init html
App()
    .render()
    .then((html) => {
        document.getElementById('app').innerHTML = html as string;
        initApp();
    });

loadData();
