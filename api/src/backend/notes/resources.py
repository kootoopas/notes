from flask_restplus import Resource

from notes.api import api

notes_ns = api.namespace('notes')


@notes_ns.route('/')
class Note(Resource):
    def get(self):
        return {'a': 1}
