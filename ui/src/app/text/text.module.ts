import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextSnippetComponent } from './text-snippet/text-snippet.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [TextSnippetComponent, TextEditorComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    TextSnippetComponent,
    TextEditorComponent
  ]
})
export class TextModule { }
