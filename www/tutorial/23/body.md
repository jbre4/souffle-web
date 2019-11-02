To gain performance in the execution of Datalog progrsm, we can:

* Compile, rather than interpret code
* Schedule queries, through user annotations or automation
* Find faster queries that perform the same desired task
* Find faster data models

To achieve these aims, profiling a given program is paramount. An overview of Soufflé’s profiler, which provides a textual and graphical UI, can be found [here](https://souffle-lang.github.io/profiler).

To compile and immediately execute a Soufflé program, the option `-c` can be used, e.g. `souffle -c test.dl` executes the binary produced from the `.cpp` file produced by `test.dl`. To just generate the executable, the option `-o` can be used.

To achieve high performance, the programmer can manually re-order the atoms in the body of a rule. The auto-scheduler can be disabled for a rule by the strict qualifier, with syntax `<rule>. .strict`. One can also provide their own query schedule, which for a given rule has syntax `<rule>. .plan{ <#version> : (idx_1, ..., idx_k) }`.

An exercise for the reader is to execute the code on the right, varying the choice of the last three lines each time, and benchmarking using the profiler:
