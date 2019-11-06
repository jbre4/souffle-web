# Server security

These are some security issues the server tries to deal with, how it deals with them, and what the ideal solution would be.

## General containment

The server is split into 2 Docker containers. One containing nginx and the static files that are served by it. The other containing souffle and the python script `server.py` that provides a HTTP API to souffle. `server.py` is proxied behind the nginx in the other container.

If the user manages to break out of `server.py` or `souffle`, they _shouldn't_ be able to get into the container containing nginx as they are isolated from each other. So they wouldn't be able to modify static files and inject malicious JS into them, or modify the nginx config, for example.

Both containers do have access to the network however, so it is possible to install SSH within the container and break into another machine on the same network if it is not secured.

Although we try to reduce the damage possible through containerization and input sanitization, server admins should assume that any compromised containers means the entire host machine and network is also compromised.

**There is no perfect solution to this.**

## HTTP validation

Python HTTP libraries aren't perfect, thus all HTTP requests go through NGINX first, providing an extra validation layer. Any malformed or ill-formed HTTP requests are more likely to be caught by NGINX before reaching our code.

## `#include` directives

Souffle uses `mcpp` as a preprocessor, this is replaced in the docker image with a script that essentially just echos the input back. Souffle is capable of ignoring preprocessor directives and comments itself.

However, this approach also breaks preprocessor macros.

### Ideal fix

An option in souffle or mcpp to disable include directives.

## `#line` directives

Syntax: `#line x "/path/to/source"`

These are normally output by the preprocessor.

Souffle interprets these to get line information for when printing errors. However it turns out souffle uses the path in that directive to fetch the line corresponding to the line number.

Users can exploit this by inserting line directives with a path such as `/etc/passwd` into their souffle code and intentionally making a syntax error before clicking run on the website, this will course souffle to error out and print lines from `/etc/passwd` and send them straight to the client. The user can change the line number in the line directive (negative numbers work) to iterate through the lines in `/etc/passwd` or whatever file they choose.

This is currently dealt with by stripping out any lines starting with # before it gets executed by souffle.

### Ideal fix

Souffle ignores the path in the line directive and prints lines from the code it is actually parsing/running instead.

## User defined functors

As far as we can tell, these can't be used to load arbitrary shared libraries from the souffle code itself, however they might be able to call into arbitrary functions that have already been loaded by souffle.

This is dealt with by stripping out all `.functor` directives from the source before running it in souffle.

### Ideal fix

An option in souffle to disable user defined functors.

## `.output` directives that specify a destination path

Currently souffle ignores these if you direct souffle to output to stdout, which we do, so this is a non-issue for us.
