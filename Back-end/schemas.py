from marshmallow import Schema, fields


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str()
    email = fields.Email()
    is_admin = fields.Bool()


class ProductSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    description = fields.Str()
    price = fields.Float(required=True)
