import {noteFeatureKey, NoteState} from './note/note.reducers';

export interface RootState {
  [noteFeatureKey]: NoteState
}
