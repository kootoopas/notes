import { createAction, props } from '@ngrx/store';
import {Note} from './note';

export const loadNotes = createAction(
  '[Note] Load Notes'
)

export const loadNotesSuccess = createAction(
  '[Note] Load Notes Success',
  props<{ notes: Note[] }>()
)

export const loadNotesFailure = createAction(
  '[Note] Load Notes Failure',
  props<{ error: Error }>()
)

export const loadNote = createAction(
  '[Note] Load Note'
)

export const loadNoteSuccess = createAction(
  '[Note] Load Note Success',
  props<{ note: Note }>()
)

export const loadNoteFailure = createAction(
  '[Note] Load Note Failure',
  props<{ error: Error }>()
)

export const initNote = createAction(
  '[Note] Init Note',
  props<{ note: Note }>()
)

export const createNote = createAction(
  '[Note] Create Note',
  props<{ title: string, body: string }>()
)

export const createNoteSuccess = createAction(
  '[Note] Create Note Success',
  props<{ note: Note }>()
)

export const createNoteFailure = createAction(
  '[Note] Create Note Failure',
  props<{ error: Error }>()
)

export const updateNote = createAction(
  '[Note] Update Note',
  props<{ id: string, title: string, body: string }>()
)

export const updateNoteSuccess = createAction(
  '[Note] Update Note Success',
  props<{ note: Note }>()
)

export const updateNoteFailure = createAction(
  '[Note] Update Note Failure',
  props<{ error: Error }>()
)

export const activateNote = createAction(
  '[Note] Activate Note',
  props<{ id: string }>()
)
