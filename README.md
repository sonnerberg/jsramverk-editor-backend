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

    or

    ```bash
    vim .env
    ```

    or

    ```bash
    nano .env
    ```

1. Start the server:

    ```bash
    npm start
    ```

You can import a json file into Postman to test all the routes of the api.


