#!/usr/bin/env babel-node
import FileParser from './src/FileParser'
import VarParser from './src/VarParser'
import ScriptParser from './src/ScriptParser'
import TagParser from './src/TagParser'
import ComponentGenerator from './src/ComponentGenerator'
import CodeFormatter from './src/CodeFormatter'

const { code, tags } = FileParser.readFile(process.argv[2])
const { props, rest } = ScriptParser.parse(code)
const { vars, nodes, listeners } = TagParser.parse(tags)


for(var key in vars)			
	console.log(  " props key = " + key + " val = " + vars[key]);					

var str = JSON.stringify(nodes);

var obj = JSON.parse(JSON.stringify(str), function(key, value) {
	console.log(  " nodes key = " + key + " val = " + value);					
})
	
const output = ComponentGenerator.generate(props, nodes, listeners, rest)
const formatted = CodeFormatter.format(output)

//console.log(formatted)
