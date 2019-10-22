import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, exhaustMap, switchMap} from 'rxjs/operators';
import { of } from 'rxjs';
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
  updateNoteFailure
} from './note.actions';
import {Note} from './note';
import {select, Store} from '@ngrx/store';
import {selectPage} from './note.selectors';
import {RootState} from '../reducers';


@Injectable()
export class NoteEffects {

  loadNotes$ = createEffect(() => this.actions$.pipe(
    ofType(loadNotes),
    mergeMap((action) => this.store.pipe(select(selectPage))),
    mergeMap((page) => this.noteService.getList(page.number, page.size).pipe(
      map((notes: Note[]) => loadNotesSuccess({ notes })),
      catchError((error) => of(loadNotesFailure({ error })))
    ))
  ))

  createNote$ = createEffect(() => this.actions$.pipe(
    ofType(createNote),
    mergeMap((action) =>
      this.noteService.create(action.title, action.body).pipe(
        switchMap((note) => [
          createNoteSuccess({ note }),
          loadNotes()
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
