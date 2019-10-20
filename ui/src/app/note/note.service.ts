import { Injectable } from '@angular/core';
import {Note} from './note';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, OperatorFunction, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {isEmptyObject} from '../../utilities';
import {marshalApiNote} from './marshallers';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  resourceUrl = `${environment.notesApiBaseUrl}/notes`

  constructor(private http: HttpClient) {}

  get(id: string): Observable<Note> {
    return this.http.get(`${this.resourceUrl}/${id}`)
      .pipe(map((note) => {
        if (isEmptyObject(note)) {
          return null
        }

        return marshalApiNote(note)
      }))
  }

  getList(page: number, size: number): Observable<Note[]> {
    return this.http.get(
      this.resourceUrl,
      {
        params: {
          page: page.toString(),
          size: size.toString()
        }
      }
    ).pipe(map((notes: any[]) => notes.map(note => marshalApiNote(note))))
  }

  search(text: string, page: number, size: number): Observable<Note[]> {
    return this.http.get(
      this.resourceUrl,
      {
        params: {
          text,
          page: page.toString(),
          size: size.toString()
        }
      }
    ).pipe(map((notes: any[]) => notes.map(note => marshalApiNote(note))))
  }

  create(title: string, body: string): Observable<Note> {
    return this.http.post(this.resourceUrl, {
      title,
      body
    }).pipe(
      map((note) => marshalApiNote(note)),
      this.catchError()
    )
  }

  update(id: string, title: string, body: string): Observable<Note> {
    return this.http.put(`${this.resourceUrl}/${id}`, {
      id,
      title,
      body
    }).pipe(
      map((note) => marshalApiNote(note)),
      this.catchError()
    )
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete(`${this.resourceUrl}/${id}`)
      .pipe(map(_ => true))
  }

  private catchError(): OperatorFunction<never, never> {
    return catchError((response: HttpErrorResponse) => throwError(new Error(response.error.message)))
  }
}
