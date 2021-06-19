import EventEmitter from 'eventemitter3';

export const event = new EventEmitter();

export enum eventKey {
    onSetData = 'onSetData',
}

export function onSetData(fn: (data: string) => void) {
    event.addListener(eventKey.onSetData, fn);
}

export function emitSetData(data: string) {
    event.emit(eventKey.onSetData, data);
}
