import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {Note} from '../note';
import {RootState} from '../../reducers';
import {selectNoteCollection, selectActiveNote} from '../note.selectors';
import {activateNote, deleteNote} from '../note.actions';
import {filter, map, withLatestFrom} from 'rxjs/operators';

@Component({
  selector: 'app-note-browser',
  templateUrl: './note-browser.component.html',
  styleUrls: ['./note-browser.component.scss']
})
export class NoteBrowserComponent implements OnInit, OnDestroy {

  notes$: Observable<Note[]>
  activeNote$: Observable<Note>
  subscriptions = new Set<Subscription>()

  constructor(private store: Store<RootState>) {}

  ngOnInit(): void {
    this.notes$ = this.store.pipe(select(selectNoteCollection))
    this.activeNote$ = this.store.pipe(select(selectActiveNote))
    this.addActiveNoteDeletionListener()
    this.addNoteNavigationListeners()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  private addActiveNoteDeletionListener(): void {
    const subscription = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter(event => event.ctrlKey && event.key === 'Backspace'),
        withLatestFrom(this.activeNote$),
        map(([event, activeNote]) => activeNote)
      ).subscribe((activeNote: Note) => {
        this.store.dispatch(deleteNote({ id: activeNote.id }))
      })
    this.subscriptions.add(subscription)
  }

  private addNoteNavigationListeners(): void {
    const subscription = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter((event) => ['ArrowUp', 'ArrowDown'].includes(event.key)),
        withLatestFrom(this.notes$, this.activeNote$)
      )
      .subscribe((([event, notes, activeNote]) => {
        const activeNoteIndex = notes.findIndex(note => note.id === activeNote.id)
        if (event.key === 'ArrowUp' && activeNoteIndex > 0) {
          this.store.dispatch(activateNote({ id: notes[activeNoteIndex - 1].id }))
        } else if (event.key === 'ArrowDown' && activeNoteIndex < notes.length - 1) {
          this.store.dispatch(activateNote({ id: notes[activeNoteIndex + 1].id }))
        }
      }))
    this.subscriptions.add(subscription)
  }

  activateNote(id: string): void {
    this.store.dispatch(activateNote({id}))
  }

}
