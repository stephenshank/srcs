const fs = require('fs'),
  { parse } = require('@babel/parser'),
  traverse = require('@babel/traverse').default;

const code_file = process.argv[2],
  code = fs.readFileSync(code_file).toString(),
  options = { sourceType: "module", plugins: [ "jsx" ] },
  ast = parse(code, options);

const imports = [];

traverse(ast, {
  CallExpression(path) {
    if (path.node.callee.name == 'require') {
      imports.push(path.node.arguments[0].value);
    }
  },
  ImportDeclaration(path) {
    const value = path.node.source.value;
    if(value[0] != '.') imports.push(value);
  }
});

console.log(JSON.stringify(imports));
