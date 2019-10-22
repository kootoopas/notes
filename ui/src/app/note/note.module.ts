import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromNote from './note.reducers';
import {HttpClientModule} from '@angular/common/http';
import { NoteEditorComponent } from './note-editor/note-editor.component';
import {TextModule} from '../text/text.module';
import { NoteBrowserComponent } from './note-browser/note-browser.component';


@NgModule({
  declarations: [NoteEditorComponent, NoteBrowserComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(fromNote.noteFeatureKey, fromNote.noteReducer),
    TextModule
  ],
  exports: [NoteEditorComponent, NoteBrowserComponent]
})
export class NoteModule { }
