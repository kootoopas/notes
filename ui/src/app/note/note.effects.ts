import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, switchMap, exhaustMap, filter, tap, withLatestFrom, combineLatest, concatMap} from 'rxjs/operators';
import {EMPTY, of} from 'rxjs';
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
  activateNote
} from './note.actions';
import {Note} from './note';
import {select, Store} from '@ngrx/store';
import {selectActiveNote, selectNoteCollection, selectPage} from './note.selectors';
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
    filter(([action, active]) => action.notes && action.notes.length && !active),
    map(([action, _]) => activateNote(action.notes[0]))
  ))

  createNote$ = createEffect(() => this.actions$.pipe(
    ofType(createNote),
    mergeMap((action) =>
      this.noteService.create(action.title, action.body).pipe(
        switchMap((note) => [
          loadNotes(),
          createNoteSuccess({ note })
        ]),
        catchError(error => of(createNoteFailure({ error })))
      )
    )
  ))

  updateNote$ = createEffect(() => this.actions$.pipe(
    ofType(updateNote),
    mergeMap((action) =>
      this.noteService.update(action.id, action.title, action.body).pipe(
        switchMap((note) => [
          updateNoteSuccess({ note }),
          loadNotes()
        ]),
        catchError(error => of(updateNoteFailure({ error })))
      )
    )
  ))

  constructor(
    private store: Store<RootState>,
    private actions$: Actions,
    private noteService: NoteService
  ) {}

}
