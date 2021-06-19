import { onSetData } from '../../event';
import { saveData } from '../../git';
import { elById, inputById } from '../../utils/dom';

export function initContent() {
    elById('save-content').onclick = () => {
        saveData(inputById('content').value);
    };

    onSetData((data) => {
        inputById('content').value = data;
    });
}
