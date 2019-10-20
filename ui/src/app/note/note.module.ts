import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromNote from './reducers';
import {HttpClientModule} from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(fromNote.noteFeatureKey, fromNote.reducers, { metaReducers: fromNote.metaReducers })
  ]
})
export class NoteModule { }
