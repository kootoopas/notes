from mongoengine import Document, fields


class Meta:
    meta = {
        'strict': False
    }


class Note(Document, Meta):
    title = fields.StringField()
    body = fields.StringField()
    creation_date = fields.DateTimeField()
    modification_date = fields.DateTimeField()

    meta = {'indexes': [
        {'fields': ['$title', "$body"],
            'default_language': 'english',
            'weights': {'title': 100, 'body': 20}
        }
    ]}
