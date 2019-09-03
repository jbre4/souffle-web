# Souffle Web IDE

## Usage

### Running the server
`cd` into the project directory then

    $ python server.py [port]

The port is optional and defaults to 8000. The server will start serving files from the `www` directory.

You may now open `http://localhost:[port]` in your browser.

**Security note:** It is highly recommended to put the server behind a webserver such as NGINX or Apache.

**TODO:** Write nginx example config.

## Python Dependencies

- url-normalize
