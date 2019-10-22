import {AfterViewInit, Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {Note} from '../note';
import {RootState} from '../../reducers';
import {selectNoteCollection, selectActiveNote} from '../note.selectors';
import {activateNote} from '../note.actions';
@Component({
  selector: 'app-note-browser',
  templateUrl: './note-browser.component.html',
  styleUrls: ['./note-browser.component.scss']
})
export class NoteBrowserComponent implements OnInit {

  notes$: Observable<Note[]>
  activeNote$: Observable<Note>

  constructor(private store: Store<RootState>) { }

  ngOnInit(): void {
    this.notes$ = this.store.pipe(select(selectNoteCollection))
    this.activeNote$ = this.store.pipe(select(selectActiveNote))
  }

  activateNote(id: string): void {
    this.store.dispatch(activateNote({id}))
  }
}
