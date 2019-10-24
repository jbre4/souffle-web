Users can specify directives for loading input and writing output to a file:

* The input directive .input <relation-name> reads from the <relation-name>.facts, which is assumed to be tab-separated by default.
* The output directive .output <relation-name> writes to a file, usually <relation-name>.csv (by default) or stdout (depending on options).
* The print relation size directive .printsize <relation-name> prints the cardinality of a given relation to stdout.

The following example illustrates the aforementioned functionality:

```
.decl A(n: symbol)
.input A // facts are read from file A.facts

.decl B(n: symbol)
B(n) :- A(n).

.decl C(n: symbol)
.output C // output appears in C.csv
C(n) :- B(n).

.decl D(n: symbol)
.printsize D // the number of facts in D is printed
D(n) :- C(n).
```

Relations can be loaded from/stored to:

* Arbitrary CSV files
* Compressed text files
* SQLite3 databases

For example, to store a relation after evaluation into a SQLite3 database, the user can specify something like this:

```
.decl A(a:number, b:number)
.output A(IO=sqlite, dbname="path/to/sqlite3db")
```
