export const MAX_STEPS_PER_BEAT = 8;
export const STEP_TICK = 1 / MAX_STEPS_PER_BEAT;

export enum ActionWorker {
    save,
    remove,
    saveNote,
    removeNote,
}

export type ActionWorkerNote = ActionWorker.saveNote | ActionWorker.removeNote;
export type ActionWorkerSequence = ActionWorker.save | ActionWorker.remove;

export type MsgWorker = MsgWorkerSequence | MsgWorkerNote;

interface MsgWorkerBase {
    type: ActionWorker;
}

interface MsgWorkerSequence extends MsgWorkerBase {
    type: ActionWorkerSequence;
    notes: NoteInWorker[];
}

interface MsgWorkerNote extends MsgWorkerBase {
    type: ActionWorkerNote;
    note: NoteInWorker;
}

export type MidiMsg = [number, number, number];

export interface NoteInWorker {
    id: string;
    outputId: string;
    trigger: number;
    duration: number;
    slide?: boolean;
    on: MidiMsg;
    off: MidiMsg;
}

// NoteOutWorker?
export interface DataOutWorker {
    id: string;
    outputId: string;
    type: 'on' | 'off';
    msg: MidiMsg;
    duration?: number;
}
