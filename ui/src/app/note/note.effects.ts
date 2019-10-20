import { Injectable } from '@angular/core';
import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import {catchError, map, concatMap, mergeMap} from 'rxjs/operators';
import { of } from 'rxjs';
import * as NoteActions from './note.actions';
import {NoteService} from './note.service';
import {loadNoteFailure, loadNotesFailure, loadNotesSuccess, loadNoteSuccess} from './note.actions';
import {Note} from './note';


@Injectable()
export class NoteEffects {

  loadNotes$ = createEffect(() => this.actions$.pipe(
    ofType(NoteActions.loadNotes),
    concatMap((action) =>
      this.noteService.getList(action.page, action.size).pipe(
        map((notes: Note[]) => loadNotesSuccess({ notes })),
        catchError(error => of(loadNotesFailure({ error }))))
    )
  ))

  createNote$ = createEffect(() => this.actions$.pipe(
    ofType(NoteActions.createNote),
    mergeMap((action) =>
      this.noteService.create(action.title, action.body).pipe(
        map((note) => loadNoteSuccess({ note })),
        catchError(error => of(loadNoteFailure({ error })))
      )
    )
  ))

  constructor(
    private actions$: Actions,
    private noteService: NoteService
  ) {}

}
