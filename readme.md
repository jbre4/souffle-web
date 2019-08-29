# Souffle Web IDE

## Usage

### Running the server
`cd` into the project directory then

    $ python server.py [port]

The port is optional and defaults to 8000. The server will start serving files from the `www` directory.

You may now open `http://localhost:[port]` in your browser.

**Security note:** In production it is strongly recommended to put the server behind a web server such as NGINX or Apache. `server.py` does not perform URL normalization by itself and thus makes it easy for clients to read system files by for example doing a HTTP GET to `/../../../../etc/passwd`.

**TODO:** Write nginx example config.
