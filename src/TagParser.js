import FileParser from './FileParser'
import ScriptParser from './ScriptParser'
import { parseFragment } from 'parse5'

var finddecls = require('./ESParser');

var visitor = require('./visitor');

const TagParser = {
    
  parse (tags) {
    const nodes = []
    const listeners = []
    let vars = this.parseTags(nodes, listeners, null, 0, tags)
    this.removeTrailingWhitespace(nodes)

    return { vars, nodes, listeners }
  },

  parseTags (nodes, listeners, parent, index, tags) {
	let vars = {}
	if(tags != null) {
		tags.forEach(tag => {
		  if (tag.nodeName === '#text') {
			vars = this.parseText(nodes, index, parent, tag)
		  } else {
			this.parseElement(nodes, listeners, index, parent, tag)
		  }
		})

	}
    return vars
  },

  parseText (nodes, index, parent, tag) {
    let text = tag.value
    let startBracket, endBracket

	let toks = text.split('---');

		let vars = []
		let rest = []
	if(toks.length == 3) {
		console.log('props = ' + toks[1]);
	//	vars = ScriptParser.parse(toks[1]);

		let scode = toks[1];
		
		var varis = finddecls.findDecls(scode);

		for(var key in varis.props)			
			console.log(  " props key = " + key + " val = " + varis.props[key]);					
	
		return varis.props;
	
	}	
	
	while (true) {
		
	  let ipos = text.indexOf('{') + 1;
	  let ipos2 = text.indexOf('{', ipos);	
		
	  if(ipos2 != -1) {	
		endBracket = text.search('\}\}')
        index = this.addBinding(nodes, index, parent, text.substr(1, endBracket - 1))
        text = text.substr(endBracket + 1)
        if (!text) break
	  
	} else if (ipos != -1) {
        index = this.addText(nodes, index, parent, text)
        break
      } else {
        index = this.addText(nodes, index, parent, text.substr(0, startBracket))
        text = text.substr(startBracket)
      }
    }
	
    return vars
  },

	
  addText (nodes, index, parent, value) {
    if (index === 0 && value.trim() === '') return index

    nodes.push({
      index,
      type: 'text',
      value,
      parent
    })

    return index + 1
  },

  addBinding (nodes, index, parent, name) {
    nodes.push({
      index,
      type: 'binding',
      name,
      parent
    })

    return index + 1
  },

  parseElement (nodes, listeners, index, parent, tag) {
    const attrs = {}
	
	if(tag.attrs != null) {
		tag.attrs.forEach(attr => {
		  if (attr.name.match(/^on:/)) {
			listeners.push({
			  index,
			  event: attr.name.split(':')[1],
			  handler: attr.value
			})
		  } else {
			attrs[attr.name] = attr.value
		  }
		})

	}
    nodes.push({
      index,
      type: 'element',
      attrs,
      name: tag.nodeName,
      parent
    })

//	console.log("tp pe name = " + tag.nodeName);

    return this.parseTags(nodes, listeners, index, index + 1, tag.childNodes)
  },

  removeTrailingWhitespace (nodes) {
    let i = nodes.length - 1
    let node = nodes[i]

    while (node.parent === null && node.type === 'text' && node.value.trim() === '') {
      nodes.splice(i, 1)

      i -= 1
      node = nodes[i]
    }
  }
}

export default TagParser
 