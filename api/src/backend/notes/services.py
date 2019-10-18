from datetime import datetime
from typing import List

from notes.models import Note


class NoteService:
    def get(self, id: str) -> Note:
        return Note.objects.with_id(id)

    def getAll(self) -> List[Note]:
        return list(Note.objects())

    def search(self, text: str) -> List[Note]:
        return list(Note.objects.search_text(text))

    def create(self, title: str, body: str) -> Note:
        date = datetime.utcnow()
        return Note(
            title=title,
            body=body,
            creation_date=date,
            modification_date=date
        ).save()

    def update(self, id: str, title: str, body: str) -> Note:
        if title is None:
            raise ValueError('note title should be specified')
        if body is None:
            raise ValueError('note body should be specified')

        note = Note.objects.with_id(id)

        if note is None:
            raise RuntimeError('id {} does not match any note'.format(id))

        note.title = title
        note.body = body
        note.modification_date = datetime.utcnow()
        note.save()
        return note

    def delete(self, id: str) -> Note:
        note = Note.objects.with_id(id)
        note.delete()
        return note
