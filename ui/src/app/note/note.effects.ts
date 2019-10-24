import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, exhaustMap, filter, withLatestFrom, concatMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {NoteService} from './note.service';
import {
  createNote,
  createNoteFailure,
  createNoteSuccess,
  loadNotes,
  loadNotesFailure,
  loadNotesSuccess,
  updateNote,
  updateNoteSuccess,
  updateNoteFailure,
  activateNote, deleteNote, deleteNoteSuccess, deleteNoteFailure
} from './note.actions';
import {Note} from './note';
import {select, Store} from '@ngrx/store';
import {selectActiveNote, selectPage} from './note.selectors';
import {RootState} from '../reducers';


@Injectable()
export class NoteEffects {

  loadNotes$ = createEffect(() => this.actions$.pipe(
    ofType(loadNotes),
    mergeMap((action) => this.store.pipe(select(selectPage))),
    exhaustMap((page) => this.noteService.getList(page.number, page.size).pipe(
      map((notes: Note[]) => loadNotesSuccess({ notes })),
      catchError((error) => of(loadNotesFailure({ error })))
    ))
  ))

  initActiveNote$ = createEffect(() => this.actions$.pipe(
    ofType(loadNotesSuccess),
    concatMap((action) => of(action).pipe(
      withLatestFrom(this.store.pipe(select(selectActiveNote)))
    )),
    // Exits if there's already an active note.
    filter(([action, active]) => action.notes && action.notes.length && !active),
    map(([action, _]) => activateNote({ id: action.notes[0].id }))
  ))

  createNote$ = createEffect(() => this.actions$.pipe(
    ofType(createNote),
    mergeMap((action) =>
      this.noteService.create(action.title, action.body).pipe(
        map((note) => createNoteSuccess({ note })),
        catchError(error => of(createNoteFailure({ error })))
      )
    )
  ))

  updateNote$ = createEffect(() => this.actions$.pipe(
    ofType(updateNote),
    mergeMap((action) =>
      this.noteService.update(action.id, action.title, action.body).pipe(
        map((note) => updateNoteSuccess({ note })),
        catchError(error => of(updateNoteFailure({ error })))
      )
    )
  ))

  deleteNote$ = createEffect(() => this.actions$.pipe(
    ofType(deleteNote),
    mergeMap((action) =>
      this.noteService.delete(action.id).pipe(
        map(() => deleteNoteSuccess({ id: action.id })),
        catchError(error => of(deleteNoteFailure({ error })))
      )
    )
  ))

  constructor(
    private store: Store<RootState>,
    private actions$: Actions,
    private noteService: NoteService
  ) {}

}
