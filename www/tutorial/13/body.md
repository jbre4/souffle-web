The functor `$` issues a new number every time it is evaluated. However, it is not permitted in recursive relations. It can be used to create unique numbers (acting as identifiers) for symbols, such as in the example on the right.

## Exercise

Given a set `A(x:symbol)`, create a successor relation `Succ(x:symbol, y:symbol)` such that the first argument contains an element x in A, and the second argument contains the successor of x, which is also an element of A. For example, the set A = {"a", "b", "c", "d"} would have successor relation Succ=(("a", "b"), ("b", "c"), ("c", "d")}. Assume that the total order of an element (a symbol in this case) is given by its ordinal number, its internal representation as a number. For example, `ord("hello")` returns the ordinal number of string `"hello"` for a given program.

## Extension

Compute the first and the last element of the successor relation.
