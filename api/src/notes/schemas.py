from marshmallow import Schema, fields


class BaseSchema(Schema):
    meta = dict(
        strict=True
    )


class NoteSchema(BaseSchema):
    id = fields.Str()
    title = fields.Str()
    body = fields.Str()


class NoteCreationInputSchema(BaseSchema):
    title = fields.Str()
    body = fields.Str()


class NoteFilterSchema(BaseSchema):
    text = fields.Str(
        missing=None
    )
