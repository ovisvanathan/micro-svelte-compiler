# Micro Svelte Compiler

A fork of Micro-svelte-compiler available at  [Svelte.js](https://svelte.dev).

As a value add, this compiler can process the greymatter and return a map of the variables defined in there.

You would expect the javascript compiler apis to intuitive. With both acorn and esprima, it is almost impossible to retrieve

the variables declared inside the frontmatter header. For starters, you can check the ESParser-old.js file in src folder, which uses

the provided esprima apis but returns null result. I had to write my own implementation available in ESParser.js to get to 

the values. Would somebody if interested take up this as a challenge and make ESParser work?

 
