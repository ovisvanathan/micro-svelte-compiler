
export class Visitor {
        /* Deal with nodes in an array */
        visitNodes(nodes) { for (const node of nodes) this.visitNode(node); }
        /* Dispatch each type of node to a function */
        visitNode(node) {
                switch (node.type) {
                        case 'Program': return this.visitProgram(node);
                        case 'VariableDeclaration': return this.visitVariableDeclaration(node);
                        case 'VariableDeclarator': return this.visitVariableDeclarator(node);
                        case 'Identifier': return this.visitIdentifier(node);
                        case 'Literal': return this.visitLiteral(node);
                }
        }
        /* Functions to deal with each type of node */
        visitProgram(node) { return this.visitNodes(node.body); }
        visitVariableDeclaration(node) { return this.visitNodes(node.declarations); }
        visitVariableDeclarator(node) {
                this.visitNode(node.id);
                return this.visitNode(node.init);
        }
        visitIdentifier(node) { return node.name; }
        visitLiteral(node) { return node.value; }
}

/* Import necessary modules */
var acorn = require('acorn');
var fs = require('fs');
/* Read the hello.js file */
/*
var hello = fs.readFileSync('hello.js').toString();
// Use acorn to generate the AST of hello.js 

var ast = acorn.parse(hello);
// Create a Visitor object and use it to traverse the AST 
var visitor = new Visitor();
visitor.visitNode(ast)
*/