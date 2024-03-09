var esprima = require('esprima');

export function findDecls(scode){
		
		let ctx
		let varis = {}
		let props = {}
		let propname, propval

		var result = esprima.parse(scode);

		var obj = JSON.parse(JSON.stringify(result), function(key, value) {
			
			if(value == 'VariableDeclaration') {
				ctx = 'newvar';
			} 
			
			if(ctx == 'newvar') {
				if(value === 'VariableDeclarator')
					ctx = 'newvardecl'
			}
			
			if(ctx == 'newvardecl') {
				if(value === 'Identifier')
					ctx = 'Ident'
			}
		
			if(ctx == 'Ident') {
				
				if(key === 'name') {
					varis.name = value;					
				} else if(key == 'type') {
				
					if(value == 'ObjectExpression') {
					//	varis.value = [];		
			//			ctx = 'ObjExp'
				//		varis.ctx = ctx;
				//		stack.push(varis);
					
					} else if(value === 'Property') {			
						ctx = 'NewProp';
						varis.props = props
					} else if(value === 'Identifier') {
					
					}			
				}
				
			} else if(ctx === 'NewProp' || ctx === 'NewPropVal') {

				if(key == 'type') { 

					if(value == 'Literal') {
						ctx = 'NewPropVal';
					}
					
				} else if(key == 'name') { 
					propname = value;
			
				} else	if(ctx == 'NewPropVal' && key == 'value')  {			

					propval = value;
					ctx = 'NewProp'
				}
				
				if(propname != null)
					props[propname] = propval;
						
			}

				varis.props = props;	
		});

	return varis;
}