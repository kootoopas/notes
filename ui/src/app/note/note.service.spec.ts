import { TestBed } from '@angular/core/testing';

import { NoteService } from './note.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Note} from './note';
import clock = jasmine.clock;
import {getDateString} from '../../test/utilities';
import {badRequestStatus, notesApiBaseUrl} from '../../test/constants';

describe('NoteService', () => {
  let service: NoteService
  let httpMock: HttpTestingController
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
  const responseNotes = [
    {
      id: 'a',
      title: 'i',
      body: 'x',
      creation_date: new Date(),
      modification_date: new Date()
    },
    {
      id: 'b',
      title: 'j',
      body: 'y',
      creation_date: new Date(),
      modification_date: new Date()
    },
  ]
  let resourceUrl: string

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    })
    service = TestBed.get(NoteService)
    httpMock = TestBed.get(HttpTestingController)
    resourceUrl = `${notesApiBaseUrl}/notes`
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('get', () => {
    it('should retrieve a single note by id', () => {
      service.get('a').subscribe(note => {
        expect(note).toEqual(notes[0])
      })

      const request = httpMock.expectOne({
        url: `${resourceUrl}/a`,
        method: 'GET'
      })

      request.flush(responseNotes[0])
    })

    it('should return null when server responds with no note', () => {
      service.get('a').subscribe(note => {
        expect(note).toEqual(null)
      })

      const request = httpMock.expectOne({
        url: `${resourceUrl}/a`,
        method: 'GET'
      })

      request.flush({})
    })
  })

  describe('getList', () => {
    it('should retrieve notes based on page', () => {
      service.getList(0, 1).subscribe(notes => {
        expect(notes).toEqual([notes[0]])
      })

      const request = httpMock.expectOne({
        url: `${resourceUrl}?page=0&size=1`,
        method: 'GET'
      })

      request.flush([responseNotes[0]])
    })

    it('should return empty array when server responds with no results', () => {
      service.getList(1, 1).subscribe(notes => {
        expect(notes).toEqual([])
      })

      const request = httpMock.expectOne({
        url: `${resourceUrl}?page=1&size=1`,
        method: 'GET'
      })

      request.flush([])
    })
  })

  describe('search', () => {
    it('should retrieve notes based on text search parameter and page', () => {
      service.search('x', 0, 1).subscribe(notes => {
        expect(notes).toEqual([notes[0]])
      })

      const request = httpMock.expectOne({
        url: `${resourceUrl}?text=x&page=0&size=1`,
        method: 'GET'
      })

      request.flush([responseNotes[0]])
    })

    it('should return empty array when server responds with no results', () => {
      service.search('z', 1, 1).subscribe(notes => {
        expect(notes).toEqual([])
      })

      const request = httpMock.expectOne({
        url: `${resourceUrl}?text=z&page=1&size=1`,
        method: 'GET'
      })

      request.flush([])
    })
  })

  describe('create', () => {
    it('should request note creation and return the created note on success', () => {
      clock().install()
      const dateMock = new Date()
      clock().mockDate(dateMock)

      service.create('k', 'z').subscribe(note => {
        expect(note).toEqual({
          id: 'c',
          title: 'k',
          body: 'z',
          creationDate: dateMock,
          modificationDate: dateMock
        } as Note)
      })

      const request = httpMock.expectOne({
        url: resourceUrl,
        method: 'POST'
      })

      request.flush({
        id: 'c',
        title: 'k',
        body: 'z',
        creation_date: getDateString(dateMock),
        modification_date: getDateString(dateMock)
      })

      clock().uninstall()
    })

    it('should throw error when server sends client error response', () => {
      service.create('k', 'z')
        .subscribe({
          error(error) {
            expect(error).toEqual(new Error('Error.'))
          }
        })

      const request = httpMock.expectOne({
        url: resourceUrl,
        method: 'POST'
      })

      request.flush({message: 'Error.'}, badRequestStatus)
    })
  })

  describe('update', () => {
    it('should request note update and return the updated note on success', () => {
      clock().install()
      const modificationDate = new Date()
      clock().mockDate(modificationDate)

      // TODO: Fix Date equality assertion
      service.update('a', 'i2', 'y2').subscribe(note => {
        expect(note).toEqual({
          id: 'a',
          title: 'i2',
          body: 'y2',
          creationDate: notes[0].creationDate,
          modificationDate
        } as Note)
      })

      const request = httpMock.expectOne({
        url: `${resourceUrl}/a`,
        method: 'PUT'
      })

      request.flush({
        id: 'a',
        title: 'i2',
        body: 'y2',
        creation_date: getDateString(notes[0].creationDate),
        modification_date: getDateString(modificationDate)
      })

      clock().uninstall()
    })

    it('should throw error when server sends client error response', () => {
      // TODO: Fix error handling to raise error instead of http thrown error
      service.update('c', 'k', 'z')
        .subscribe({
          error(error) {
            expect(error).toEqual(new Error('Error.'))
          }
        })

      const request = httpMock.expectOne({
        url: `${resourceUrl}/c`,
        method: 'PUT'
      })

      request.flush({message: 'Error.'}, badRequestStatus)
    })
  })

  describe('delete', () => {
    it('should request note deletion', () => {
      service.delete('a').subscribe((deletion) =>  {
        expect(deletion).toBeTruthy()
      })

      const request = httpMock.expectOne({
        url: `${resourceUrl}/a`,
        method: 'DELETE'
      })

      request.flush({})
    })
  })
});
