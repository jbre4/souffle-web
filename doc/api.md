# HTTP API documentation

### `POST /api/run`

#### Input

A JSON object containing these fields:

- `souffle_code`: JSON string containing the souffle code.

- `tables`: A JSON array of objects, each containing the fields:
	- `name`: A JSON string containing the name of the table as declared in the souffle code.
	- `ncols`: An integer holding the number of colums.
	- `data`: A JSON array of JSON arrays of strings, i.e. a 2D JSON array of strings. Example, `[["1", "2", "3"], ["4", "5", "6"]]` where `["1", "2", "3"]` is the first row and `["4", "5", "6"]` is the second row.

Example:

	{
	  "souffle_code": "...",
	  
	  "tables": [
	    {
	      "name": "foo",
	      "ncols": 2,
	      "data": [
	        ["3", "6"],
	        ["2", "4"],
	        ["9", "3"]
	      ]
	    },
	    {
	      "name": "bar",
	      "ncols": 3,
	      "data": [
	        ["a", "b", "c"],
	        ["d", "e", "f"]
	      ]
	    }
	  ]
	}

Here the tables `foo` and `bar` represent the souffle fact files

	3	6
	2	4
	9	3

and

	a	b	c
	d	e	f

respectively.

#### Response

Plaintext output from stdout if the process return code is 0 or plaintext output from stderr otherwise.
