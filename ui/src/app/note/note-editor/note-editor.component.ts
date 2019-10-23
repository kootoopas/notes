import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Note} from '../note';
import {BehaviorSubject, fromEvent, Subscription} from 'rxjs';
import {RootState} from '../../reducers';
import {selectActiveNote} from '../note.selectors';
import {activateRecentlyModifiedNote, createNote, updateNote} from '../note.actions';
import {createEmptyNote} from '../index';
import {debounceTime, filter, map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.scss']
})
export class NoteEditorComponent implements OnInit, OnDestroy {

  writableNote$ = new BehaviorSubject<Note>(createEmptyNote())
  subscriptions: Set<Subscription>

  constructor(private store: Store<RootState>) {}

  ngOnInit(): void {
    this.store.dispatch(activateRecentlyModifiedNote())

    const noteSubscription = this.store.pipe(
      select(selectActiveNote),
      map((note: Note) => note || createEmptyNote()),
    ).subscribe(this.writableNote$)

    const newNoteEventSubscription = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter(event => event.ctrlKey && event.key === 'n'),
        debounceTime(200)
      )
      .subscribe(() => this.requestNewNote())

    this.subscriptions = new Set([noteSubscription, newNoteEventSubscription])
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  requestTitleEdit(note: Note, title: string): void {
    this.writableNote$.next({...note, title})
    this.store.dispatch(updateNote(this.writableNote$.getValue()))
  }

  requestBodyEdit(note: Note, body: string): void {
    this.writableNote$.next({...note, body})
    this.store.dispatch(updateNote(this.writableNote$.getValue()))
  }

  createMeta(note: Note): Map<string, string> {
    if (!note || !note.creationDate || !note.modificationDate) {
      return new Map()
    }

    return new Map([
      ['creation date', note.creationDate.toLocaleString()],
      ['modification date', note.modificationDate.toLocaleString()]
    ])
  }

  requestNewNote(): void {
    // Save editing note.
    this.store.dispatch(updateNote(this.writableNote$.getValue()))

    this.writableNote$.next(createEmptyNote())

    // Create new note.
    this.store.dispatch(createNote(this.writableNote$.getValue()))
  }
}
