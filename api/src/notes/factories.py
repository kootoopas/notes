from notes.services import NoteService, QuerySetPaginationService


def queryset_pagination_service() -> QuerySetPaginationService:
    return QuerySetPaginationService()


def note_service() -> NoteService:
    return NoteService(pagination_service=queryset_pagination_service())
