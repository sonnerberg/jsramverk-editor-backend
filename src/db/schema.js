export const schema = {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            additionalProperties: false,
            required: ['name', 'html'],
            properties: {
                _id: {
                    bsonType: 'objectId',
                },
                html: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                    minLength: 1
                },
                name: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                    minLength: 1
                },
            },
        },
    },
}
