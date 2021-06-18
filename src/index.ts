import { loadData } from './git';
import { initApp } from './view/app';
import { App } from './view/App';

// init html
App()
    .render()
    .then((html) => {
        document.getElementById('app').innerHTML = html as string;
        initApp();
    });

loadData();
