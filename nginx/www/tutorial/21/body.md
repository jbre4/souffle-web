Recursively-defined records are permitted in Soufflé. The recursion is terminated by the existence of a nil record. Consider the example on the right:

Here, an `IntList` contains a reference to the next element, which is an `IntList` itself.

As before, the `Flatten` relation allows for output.

The semantics of recursive records are tricky. Records are relations and sets of recursive elements, which monotonically grow in size over time. They are equivalent to relations with the use of the `nil`\` record. In the future, polymorphism may be possible at the expense of execution time and space.
