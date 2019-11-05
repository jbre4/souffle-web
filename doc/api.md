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

A JSON object containing the following fields:

- `return_code`: Integer, return code of the souffle process.
- `stdout`: String, stdout of souffle.
- `stderr`: String, stderr of souffle.

#### Errors

The following is a list of errors this API function can return and their meanings.

- 400
    - Invalid JSON **OR**
    - Missing JSON field **OR**
    - Wrong Content-Type (should be `application/json`)
- 500 - The souffle executable was not found
- 408 - A time or memory constraint was violated

In all the above cases, the body will contain a JSON object with a single field `error` containing a human friendly description of the error.

### All other URLS

404 is returned.
