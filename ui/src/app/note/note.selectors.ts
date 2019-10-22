import {RootState} from '../reducers';
import {noteFeatureKey, NoteState} from './note.reducers';
import {createFeatureSelector, createSelector} from '@ngrx/store';

export const selectNoteFeature = createFeatureSelector<RootState, NoteState>(noteFeatureKey)

export const selectNoteCollection = createSelector(
  selectNoteFeature,
  (state) => state.collection
)


export const selectActiveNote = createSelector(
  selectNoteFeature,
  (state) => state.active
)

export const selectPage = createSelector(
  selectNoteFeature,
  (state) => state.page
)
