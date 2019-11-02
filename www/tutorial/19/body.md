Relations are two-dimensional structures in Datalog. With a large code-base and/or a complex problem, it can be convenient to consider relations with more complex structure (recursion/hierarchy, etc.). Records provide such an abstraction, breaking out of the flat world of Datalog at the price of performance, due to an additional table lookup required when invoking records. Their semantics are comparable to those in Pascal/C. Currently, polymorphic types are not supported. #TODO - true? The syntax of a Record Type definition is as follows:

```
.type <name> = [ <name_1>: <type_1>, ..., <name_k>: <type_k> ]
```

Currently, there is no output facility, but it is planned that Soufflé 2.0 will support this. In the meantime, this can be simulated by mapping records to relations, where `.output` can then be called. The example on the right creates a record corresponding to a pair of numbers, in which the `Flatten` relation can be then be printed.
