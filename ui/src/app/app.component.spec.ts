import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {provideMockStore} from '@ngrx/store/testing';
import {Store} from '@ngrx/store';
import {RootState} from './reducers';
import {initialState as noteInitialState, noteFeatureKey} from './note/note.reducers';
import {Component, DebugElement} from '@angular/core';
import {loadNotes} from './note/note.actions';

describe('AppComponent', () => {
  let store: Store<RootState>
  let fixture: ComponentFixture<AppComponent>

  @Component({ selector: 'app-note-editor', template: '' })
  class NoteEditorStubComponent {}

  @Component({ selector: 'app-note-browser', template: '' })
  class NoteBrowserStubComponent {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        NoteEditorStubComponent,
        NoteBrowserStubComponent
      ],
      providers: [
        provideMockStore({
          initialState: {
            [noteFeatureKey]: noteInitialState
          }
        })
      ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent)
    store = TestBed.get<Store<RootState>>(Store)
  })

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance
    expect(app).toBeTruthy()
  })

  it('should load notes on initialization', () => {
    const dispatchSpy = spyOn(store, 'dispatch')

    fixture.detectChanges()

    expect(dispatchSpy).toHaveBeenCalledTimes(1)
    expect(dispatchSpy).toHaveBeenCalledWith(loadNotes())
  })
})
