export const usersSchema = {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            additionalProperties: false,
            required: ['email', 'password'],
            properties: {
                _id: {
                    bsonType: 'objectId',
                },
                email: {
                    bsonType: 'string',
                    // [<input type="email"> - HTML: HyperText Markup Language | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#basic_validation)
                    pattern:
                        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
                    description: 'must be a string and is required',
                    minLength: 4,
                },
                password: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                    minLength: 5,
                },
                docs: {
                    bsonType: 'array',
                    required: ['name', 'text', '_id'],
                    properties: {
                        _id: {
                            bsonType: 'objectId',
                        },
                        name: {
                            bsonType: 'string',
                            description: 'name of document',
                        },
                        text: {
                            bsonType: 'string',
                            description: 'content of document',
                        },
                        allowedUsers: {
                            bsonType: 'array',
                            properties: {
                                _id: {
                                    bsonType: 'objectId',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
}
