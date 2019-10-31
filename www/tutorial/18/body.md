Consider the example to the right which will not compile.

Here, the user wishes to produce a witness for the maximum value of the first argument of `A`. This causes semantic and performance issues. Semantically, it is not clear what it means to find a witness for the `count` and `sum` functors. In terms of performance, there is overhead. As such, this kind of code is forbidden by the type-checker.
