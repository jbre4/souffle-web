Among other functors, Soufflé permits arithmetic functors, which extend traditional Datalog semantics. Variables in functors must be grounded for use. That is, they may not contain any free variables. As described earlier, termination may be a problem as in the case of an imperative `while` loop.

A basic example is to the right.

In particular, the second condition in the conjunction on the last line invokes the arithmetic operator `<`.

## Exercise

Output the first 10 numbers of the Fibonacci numbers via a Soufflé program.

The first two numbers in the sequence are 1. Every number after the first two is the sum of the two preceding numbers. Here, the sequence is 1, 1, 2, 3, 5, ... 

The following arithmetic functors are allowed in Soufflé:
- Addition: `x + y`
- Subtraction: `x - y`
- Division: `x / y`
- Multiplication: `x * y`
- Modulo: `a % b`
- Power: `a ^ b`
- Counter: `$`
- Bit operations: `x band y`, `x bor y`, `x bxor y`, `bnot x`
- Logical operations: `x land y`, `x lor y`, and `lnot x`

The following arithmetic constraints are allowed in Soufflé:
- Less than: `a < b`
- Less than or equal to: `a <= b`
- Equal to: `a = b`
- Not equal to: `a != b`
- Greater than or equal to: `a >= b`
- Greater than: `a > b`

In source code, numbers can be written in decimal, binary and hexadecimal. Below is an example illustrating such:

	.decl A(x:number)
	A(4711).
	A(0b101).
	A(0xaffe).

Note that in fact files only decimal numbers are permitted.
