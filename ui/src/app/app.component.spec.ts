import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {NoteModule} from './note/note.module';
import {provideMockStore} from '@ngrx/store/testing';
import {Store} from '@ngrx/store';
import {RootState} from './reducers';
import {initialState as noteInitialState, noteFeatureKey} from './note/note.reducers';

describe('AppComponent', () => {
  let store: Store<RootState>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoteModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        provideMockStore({
          initialState: {
            [noteFeatureKey]: noteInitialState
          }
        })
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
