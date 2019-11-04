Rules with multiple heads can be written. This is syntactic sugar to minimise coding effort. Here is a code snippet taking advantage of this feature and the equivalent code without the transformation applied:

<table>
<tr>
<th>
Multiple heads
</th>
<th>
Single head
</th>
</tr>

<tr>

<td>
<pre>
.decl A(x:number)
A(1). A(2). A(3).
.decl B(x:number)
.decl C(x:number)<br/>
B(x), C(x) :- A(x).
.output B,C
</pre>

</td>

<td>
<pre>
.decl A(x:number)
A(1). A(2). A(3).
.decl B(x:number)
B(x) :- A(x).
.decl C(x:number)
C(x) :- A(x).
.output B,C
</pre>
</td>

</tr>
</table>

Similarly, disjunctions in rule bodies are permitted as syntactic sugar, such as in the following example:

<table>
  <tr>
    <th>
      Disjunction in rule bodies
    </th>
    <th>
      No disjunction in rule bodies
    </th>
  </tr>
  <tr>
    <td>
      <pre>
.decl edge(x:number, y:number)
edge(1,2). edge(2,3).
.decl path(x:number, y:number)
path(x,y) :-
  edge(x,y);
  edge(x,q), path(q,y).
.output path
      </pre>
    </td>
    <td>
      <pre>
.decl edge(x:number, y:number)
edge(1,2). edge(2,3).
.decl path(x:number, y:number)
path(x,y) :- edge(x,y).
path(x,y) :- edge(x,q), path(q,y).
      </pre>
    </td>
  </tr>
</table>
