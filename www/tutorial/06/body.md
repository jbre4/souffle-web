Users can specify directives for loading input and writing output to a file:

* The input directive `.input <relation-name>` reads from the `<relation-name>.facts`, which is assumed to be tab-separated by default.
* The output directive `.output <relation-name>` writes to a file, usually `<relation-name>.csv` (by default) or stdout (depending on options).
* The print relation size directive `.printsize <relation-name>` prints the cardinality of a given relation to stdout.

The example on the right illustrates the aforementioned functionality.

Relations can be loaded from/stored to:

* Arbitrary CSV files
* Compressed text files
* SQLite3 databases

For example, to store a relation after evaluation into a SQLite3 database, the user can specify something like this:

```
.decl A(a:number, b:number)
.output A(IO=sqlite, dbname="path/to/sqlite3db")
```
