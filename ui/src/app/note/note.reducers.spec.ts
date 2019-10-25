import {initialState as initialNoteState, noteReducer, NoteState} from './note.reducers';
import {createNoteSuccess, deleteNoteSuccess, loadNotesSuccess, updateNoteSuccess} from './note.actions';
import {Note} from './note';

describe('noteReducer', () => {
  let initialState: NoteState

  beforeEach(() => {
    initialState = {
      ...initialNoteState,
      collection: [
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
        {
          id: 'b\'',
          title: 'j',
          body: 'y\'',
          creationDate: new Date(),
          modificationDate: new Date()
        }
      ]
    }
  })

  describe('on note creation success', () => {
    const note: Note = {
      id: 'c',
      title: 'k',
      body: 'z',
      creationDate: new Date(),
      modificationDate: new Date()
    }

    it('should prepend created note to collection', () => {
      const resultStateCollection = noteReducer(initialState, createNoteSuccess({ note })).collection
      expect(resultStateCollection).toEqual([note, ...initialState.collection])
    })

    it('should activate created note', () => {
      expect(noteReducer(initialState, createNoteSuccess({ note })).active).toEqual(note)
    })
  })

  describe('on notes load success', () => {
    const notes: Note[] = [
      {
        id: 'c',
        title: 'k',
        body: 'z',
        creationDate: new Date(),
        modificationDate: new Date()
      },
      {
        id: 'c\'',
        title: 'k\'',
        body: 'z\'',
        creationDate: new Date(),
        modificationDate: new Date()
      }
    ]

    it('should set collection to loaded notes', () => {
      expect(noteReducer(initialState, loadNotesSuccess({ notes })).collection).toEqual(notes)
    })

    it('should update active note if it\'s in loaded notes', () => {
      initialState.active = {
        id: 'c',
        title: '',
        body: '',
        creationDate: new Date(),
        modificationDate: new Date()
      }
      expect(noteReducer(initialState, loadNotesSuccess({ notes })).active).toEqual(notes[0])
    })

    it('should not update activate not if it isn\'t in loaded notes', () => {
      expect(noteReducer(initialState, loadNotesSuccess({ notes })).active).toBeNull()
    })
  })

  describe('on note update success', () => {
    const note: Note = {
      id: 'b',
      title: 'j\'',
      body: 'y',
      creationDate: new Date(),
      modificationDate: new Date()
    }

    it('should update note in collection', () => {
      const resultStateCollection = noteReducer(initialState, updateNoteSuccess({ note })).collection
      expect(resultStateCollection).toEqual([initialState.collection[0], note , initialState.collection[2]])
    })

    it('should update active note if it\'s the one that\'s been updated', () => {
      initialState.active = initialState.collection[1]
      expect(noteReducer(initialState, updateNoteSuccess({ note })).active).toEqual(note)
    })

    it('shouldn\'t update active note if it isn\'t the one that\'s been updated', () => {
      initialState.active = initialState.collection[2]
      expect(noteReducer(initialState, updateNoteSuccess({ note })).active).toEqual(initialState.active)
    })
  })

  describe('on note deletion success', () => {
    it('should remove note from collection', () => {
      const resultStateCollection = noteReducer(initialState, deleteNoteSuccess({id: 'b'})).collection
      expect(resultStateCollection).toEqual([initialState.collection[0], initialState.collection[2]])
    })

    it('should set active note to previous element of collection when deleted note index is greater than 0', () => {
      initialState.active = initialState.collection[1]
      expect(noteReducer(initialState, deleteNoteSuccess({id: 'b'})).active).toEqual(initialState.collection[0])
    })

    it('should set active note to next element of collection (second element) when deleted note is first in collection', () => {
      initialState.active = initialState.collection[0]
      expect(noteReducer(initialState, deleteNoteSuccess({id: 'a'})).active).toEqual(initialState.collection[1])
    })

    it('should set active note to null if deleted note is sole in collection', () => {
      initialState.collection = [initialState.collection[0]]
      initialState.active = initialState.collection[0]
      expect(noteReducer(initialState, deleteNoteSuccess({id: 'a'})).active).toEqual(null)
    })
  })
})
