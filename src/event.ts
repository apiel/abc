import EventEmitter from 'eventemitter3';
import { SequenceData } from './sequence';

export const event = new EventEmitter();

export enum eventKey {
    onMIDISuccess = 'onMIDISuccess',
    onMIDIError = 'onMIDIError',
    onBPMchange = 'onBPMchange',
    onSequencesChange = 'onSequencesChange',
    onSequenceChange = 'onSequenceChange',
    onSequenceChangeValue = 'onSequenceChangeValue',
    onSequenceAdd = 'onSequenceAdd',
    onTrackChange = 'onTrackChange',
}

export function onSequenceChangeValue(
    fn: ({ sequence: SequenceData, key: string }) => void,
) {
    event.addListener(eventKey.onSequenceChangeValue, fn);
}

export function emitSequenceChangeValue(sequence: SequenceData, key: string) {
    event.emit(eventKey.onSequenceChangeValue, { sequence, key });
}

export function onSequenceChange(fn: (sequence: SequenceData) => void) {
    event.addListener(eventKey.onSequenceChange, fn);
}

export function emitSequenceChange(sequence: SequenceData) {
    event.emit(eventKey.onSequenceChange, sequence);
}

export function onSequencesChange(fn: (sequences: SequenceData[]) => void) {
    event.addListener(eventKey.onSequencesChange, fn);
}

export function emitSequencesChange(sequences: SequenceData[]) {
    event.emit(eventKey.onSequencesChange, sequences);
}

export function onSequenceAdd(fn: (sequence: SequenceData) => void) {
    event.addListener(eventKey.onSequenceAdd, fn);
}

export function emitSequenceAdd(sequence: SequenceData) {
    event.emit(eventKey.onSequenceAdd, sequence);
}
