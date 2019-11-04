# Souffle Web IDE

A web interface for the logic programming language [Souffle](https://souffle-lang.github.io/index.html).

## Running the server

### In Docker
Install `docker` and `docker-compose`, then `cd` into the project directory and run

    docker-compose build

to build the image. This may take a little bit of time, but only needs to be run initially.

To start the server:

    docker-compose up -d

The `-d` flag daemonizes it. The server should now be listening on port 8000. Try opening `http://localhost:8000` in your browser.

To stop the server:

    docker-compose down

#### Updating

After pulling new changes, the docker image must be rebuilt, this should be done automatically by `docker-compose` by detecting the changes. If this doesn't happen, refer to the section directly below.

#### Updating Souffle

If you wish to update `souffle`, you must force rebuild the image from scratch:

    docker-compose build --no-cache

This will force the latest version of souffle to be cloned and built upon image creation.

#### Dependencies

- Python 3.7
- [Souffle](https://github.com/souffle-lang/souffle)
