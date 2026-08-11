import EventEmitter from 'eventemitter3';

export const event = new EventEmitter();

export enum eventKey {
    onSetData = 'onSetData',
    onMigrationAvailable = 'onMigrationAvailable',
    onUnlocked = 'onUnlocked',
}

export function onSetData(fn: (data: string) => void) {
    event.addListener(eventKey.onSetData, fn);
}

export function emitSetData(data: string) {
    event.emit(eventKey.onSetData, data);
}

export function onMigrationAvailable(fn: (v1Content: string) => void) {
    event.addListener(eventKey.onMigrationAvailable, fn);
}

export function emitMigrationAvailable(v1Content: string) {
    event.emit(eventKey.onMigrationAvailable, v1Content);
}

export function onUnlocked(fn: () => void) {
    event.addListener(eventKey.onUnlocked, fn);
}

export function emitUnlocked() {
    event.emit(eventKey.onUnlocked);
}
