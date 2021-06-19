import { initContent } from './Content/content';
import { initSettings } from './Settings/settings';

export function initApp() {
    initSettings();
    initContent();
}
