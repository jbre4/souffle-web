A relation R on a set X is transitive if, for all x, y, z in X, whenever x R y and y R z then x R z. In the example to the right, we consider a directed graph, where edges define relations, and a tuple is in the transitive closure (the `reachable` relation) if it satisfies either of the two rules to the right.

Try pressing the run button (▶) to run the example on the right.

Indeed, all elements in `edge` are in `reachable` (by the base rule), and the inductive rule captures the transitive property, including tuples like `reachable("a", "d")`.

## Exercises
1. Extend the code to add a new relation `SCC(x, y)`, that is defined as: if node x reaches node y and node y reaches node x, then (x, y) is in SCC.
2. Check whether a node is cyclic.
3. Check whether the graph is acyclic.
