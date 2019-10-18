from marshmallow import Schema


class BaseSchema(Schema):
    meta = dict(
        strict=True
    )
