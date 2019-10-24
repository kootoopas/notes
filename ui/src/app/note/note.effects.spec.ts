import { provideMockActions } from '@ngrx/effects/testing';
import {TestBed} from '@angular/core/testing';
import {Action, Store} from '@ngrx/store';
import {Observable, of, throwError} from 'rxjs';
import {NoteService} from './note.service';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {
  activateNote,
  createNote,
  createNoteFailure,
  createNoteSuccess,
  loadNotes,
  loadNotesFailure,
  loadNotesSuccess
} from './note.actions';
import {NoteEffects} from './note.effects';
import {selectActiveNote, selectNoteCollection, selectPage} from './note.selectors';
import {RootState} from '../reducers';
import {asSpy} from '../../test/utilities';
import {Note} from './note';
import createSpyObj = jasmine.createSpyObj;

describe('NoteEffects', () => {
  let effects: NoteEffects
  let actions$: Observable<Action>
  let store: MockStore<RootState>
  let noteServiceMock: NoteService
  const notes: Note[] = [
    {
      id: 'a',
      title: 'i',
      body: 'x',
      creationDate: new Date(),
      modificationDate: new Date()
    },
    {
      id: 'b',
      title: 'j',
      body: 'y',
      creationDate: new Date(),
      modificationDate: new Date()
    },
  ]

  beforeEach(() => {
    noteServiceMock = jasmine.createSpyObj(
      'NoteService',
      ['getList', 'create', 'update', 'delete']
    )
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            {
              selector: selectPage,
              value: {
                number: 0,
                size: 100
              }
            },
            {
              selector: selectActiveNote,
              value: null
            },
            {
              selector: selectNoteCollection,
              value: notes
            }
          ]
        }),
        { provide: NoteService, useValue: noteServiceMock },
        NoteEffects
      ],
    })
    effects = TestBed.get<NoteEffects>(NoteEffects)
    store = TestBed.get<Store<RootState>>(Store)
  })

  describe('load notes', () => {
    it('should fetch notes and signal success', () => {
      asSpy(noteServiceMock.getList).and.returnValue(of(notes))
      actions$ = of(loadNotes())

      effects.loadNotes$.subscribe(action => {
        expect(action).toEqual(loadNotesSuccess({ notes }))
      })
    })

    it('should fail when note fetching fails', () => {
      asSpy(noteServiceMock.getList).and.returnValue(throwError(new Error('Error.')))
      actions$ = of(loadNotes())

      effects.loadNotes$.subscribe(action => {
        expect(action).toEqual(loadNotesFailure({ error: new Error('Error.') }))
      })
    })
  })

  describe('init active note', () => {
    it('should activate first note when there\'s no active one after notes are loaded', () => {
      actions$ = of(loadNotesSuccess({ notes }))

      effects.initActiveNote$.subscribe(action => {
        expect(action).toEqual(activateNote({id: 'a'}))
      })
    })

    it('should do nothing if a note is already active', () => {
      actions$ = of(loadNotesSuccess({ notes }))
      store.overrideSelector(selectActiveNote, notes[0])
      const observerSpy = createSpyObj(['next', 'error', 'complete'])

      effects.initActiveNote$.subscribe(observerSpy)

      expect(asSpy(observerSpy.next)).not.toHaveBeenCalled()
      expect(asSpy(observerSpy.error)).not.toHaveBeenCalled()
      expect(asSpy(observerSpy.complete)).toHaveBeenCalledTimes(1)
    })
  })

  describe('create note', () => {
    it('should create note and signal success', () => {
      const note: Note = {
        id: 'd',
        title: 'i\'',
        body: 'x\'',
        creationDate: new Date(),
        modificationDate: new Date()
      }
      asSpy(noteServiceMock.create).and.returnValue(of(note))
      actions$ = of(createNote({ title: 'd', body: 'x\'' }))

      effects.createNote$.subscribe((action) => {
        expect(action).toEqual(createNoteSuccess({ note }))
      })
    })

    it('should fail when error occurs in note creation', () => {
      asSpy(noteServiceMock.create).and.returnValue(throwError(new Error('Error.')))
      actions$ = of(createNote({ title: 'd', body: 'x\'' }))

      effects.createNote$.subscribe((action) => {
        expect(action).toEqual(createNoteFailure({ error: new Error('Error.') }))
      })
    })
  })

  describe('update note', () => {

  })

  describe('delete note', () => {

  })
})
