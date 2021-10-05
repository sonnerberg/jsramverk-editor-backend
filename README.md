# Backend for the course jsramverk

1. To use the backend, start by cloning the code to your local computer:

    ```bash
    git clone https://github.com/sonnerberg/jsramverk-editor-backend
    ```

1. Change into the newly created directory:

    ```bash
    cd jsramverk-editor-backend
    ```

1. Install all the dependencies:

    ```bash
    npm run reinstall
    ```

1. Make a copy of the `.env`-example file:

    ```bash
    cp .env.example .env
    ```

1. Edit the .env file to suit your needs.

    ```bash
    code .env
    ```

    or:

    ```bash
    vim .env
    ```

    or:

    ```bash
    nano .env
    ```

1. Start the server (this will use a local database):

    ```bash
    npm run develop
    ```

    If you want to use [Mongo DB Atlas](https://www.mongodb.com/cloud/atlas), instead run:

    ```bash
    npm start
    ```

You can import a [json](https://github.com/sonnerberg/jsramverk-editor-backend/blob/main/jsramverk-editor-backend.postman_collection.json) file into [Postman](https://www.postman.com/) to test all the routes of the api.

The routes are structures in the following way:

* `POST /api/v1/create`: Create a new document using a body containing `name` and `html`.
* `PUT /api/v1/update`: Update an existing document using a body containing `_id`, `name`, and `html`.
* `GET /api/v1/`: Get a list of all documents with their `_id`, `name`, and `html`.
* `GET /api/v1/:id` : Get a single document where `:id` is a valid document `_id`.
