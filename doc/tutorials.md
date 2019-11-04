# Writing a tutorial

## `index.json`

Before writing the actual tutorial content, you first must edit `nginx/www/tutorial/index.json`. This file is fetched and parsed when the page loads.

**Note**: All URLs in this file are relative to `tutorial/` and must not contain a leading slash.

The file contains an array of objects, where each object describes a tutorial. The fields in this object are as follows:

- `name`: The name of the tutorial, this will be displayed in the sidebar tutorial list. This should be kept short.
- `title`: The full title, this is displayed in the sidebar when you click on the tutorial. If this is left out it defaults to the value of `name`.
- `markdown`: A relative URL to the file containing the tutorial markdown. This is rendered and displayed in the sidebar when clicked on.
- `prefill`: A relative URL to a text file that should be preloaded into the editor when starting the tutorial.
	- If this is left out, the editor is cleared.
	- If this is the special string `preserve`, the editor contents are not touched.
- `tables`: An array of tables to preload upon starting the tutorial.
	- If this is left out, all tables are cleared.
	- If this is the special string `preserve`, the tables are not touched.
	- Otherwise the value is an array, one for each table, where each element is also an array containing 3 items:
		- name
		- number of columns _(if this is <1 or does not match the data, the behaviour is undefined)_
		- relative URL to CSV file containing table data
	- Example: `["foo", 2, "foo.csv"]`
- `section`: Turns this tutorial into a section header. **All other fields are ignored if this is present**. See Sections section further below.

Example:

	[
		{
			"name": "Test tutorial",
			"title": "This is a test tutorial to see if it works",
			"markdown": "testtut/body.md",
			"prefill": "testtut/prefill.dl",
			"tables": [
				["foo", 1, "testtut/foo.csv"]
				["bar", 3, "testtut/bar.csv"]
			]
		},
		{
			"name": "Blank tutorial",
			"title": "Blank tutorial that preserves the editor input",
			"markdown": "blank.md",
			"prefill": "preserve",
			"tables": "preserve"
		},
		{
			"name": "Tutorial that clears everything",
			"markdown": "blank.md"
		}
	]

## Tutorial content

Tutorial content is written in Markdown. All relative links in tutorial markdown are relative to `tutorial/`.

## Table data

Table data is specified in CSV using tabs for seperators instead of commas.

## Sections

You can create sections by inserting a JSON object with a single string field called `section` whose value is the section name, example:

	{"section": "This is a section"}

This will appear in the tutorials section as non-clickable text approximately like this:

		...
		tutorial B
	
	This is a section:
		tutorial C
		tutorial D
		...
