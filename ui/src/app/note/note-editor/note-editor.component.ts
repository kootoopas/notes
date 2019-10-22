import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Note} from '../note';
import {Observable} from 'rxjs';
import {RootState} from '../../reducers';
import {selectActiveNote} from '../note.selectors';
import {createNote, updateNote} from '../note.actions';

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.scss']
})
export class NoteEditorComponent implements OnInit {

  note$: Observable<Note>

  constructor(private store: Store<RootState>) {}

  ngOnInit(): void {
    this.note$ = this.store.pipe(select(selectActiveNote))
  }

  requestNoteEdit(id: string, title: string, body: string): void {
    if (id) {
      this.store.dispatch(updateNote({id, title, body}))
      return
    }

    this.store.dispatch(createNote({title, body}))
  }
}
