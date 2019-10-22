import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {RootState} from './reducers';
import {loadNotes} from './note/note.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private store: Store<RootState>) {}

  ngOnInit(): void {
    this.store.dispatch(loadNotes())
  }
}
