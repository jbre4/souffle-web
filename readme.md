# Soufflé Web IDE

A web interface for the logic programming language [Soufflé](https://souffle-lang.github.io/index.html).

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

#### Configuration

Create a file called `config.json` in the repositories top-level directory. This can be copied from `doc/config.json` for a default one. (`config.json` is _not_ tracked by git.)

Then, [read the configuration docs](doc/config.md).

Finally, rebuild and restart the server (see **Updating**).

_Note: if `config.json` is not created, then `doc/config.json` will be copied into the docker image and used instead._

#### Updating

After pulling or making new changes or changing configuration, simply run

    docker-compose up -d --build

to rebuild the image and restart the server in one go.

#### Updating Soufflé

If you wish to update `souffle`, you must force rebuild the image from scratch:

    docker-compose build --no-cache

This will force the latest version of `souffle` to be cloned and built upon image creation.

### Dependencies

- Python 3.7
- [souffle](https://github.com/souffle-lang/souffle)

## Automated tests

Start the server then navigate to `[hostname]/test` in your browser and click `run tests`. This will run the test suite.

## Documentation

- [Configuration](doc/config.md)
- [API documentation](doc/api.md)
- [Tutorial documentation](doc/tutorials.md)
- [Security](doc/security.md)
