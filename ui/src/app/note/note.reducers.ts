import {
  Action,
  createReducer,
  on
} from '@ngrx/store';
import {Note} from './note';
import {activateNote, activateRecentlyModifiedNote, createNoteSuccess, initNote, loadNotesSuccess} from './note.actions';
import {Page} from './page';

export const noteFeatureKey = 'note';

export interface NoteState {
  collection: Note[];
  active: Note;
  page: Page;
};

export const initialState: NoteState = {
  collection: [],
  active: null,
  page: {
    number: 0,
    size: 100
  }
}

const noteReducer1 = createReducer(
  initialState,
  on(loadNotesSuccess, (state, {notes}) => ({
    ...state,
    collection: notes,
    active: state.active && notes.find(note => note.id === state.active.id) || state.active
  })),
  on(createNoteSuccess, (state, {note}) => ({
    ...state,
    collection: [note, ...state.collection],
    active: note
  })),
  on(updateNoteSuccess, (state, {note}) => {
    const noteIndex = state.collection.findIndex((collectionNote) => collectionNote.id === note.id)
    return ({
      ...state,
      collection: [...state.collection.slice(0, noteIndex), note, ...state.collection.slice(noteIndex + 1)],
      active: note
    });
  }),
  on(activateNote, (state, {id}) => ({
    ...state,
    active: state.collection.find(note => note.id === id) || state.active
  })),
)

export function noteReducer(state: NoteState | undefined, action: Action) {
  return noteReducer1(state, action)
}
