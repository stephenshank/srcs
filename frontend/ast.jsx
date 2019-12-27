import React, { useState} from 'react';
import {parse} from '@babel/parser';
import ReactJson from 'react-json-view'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import _ from "underscore";

function cleannode(node) {
  if(_.isObject(node)) {
    delete node.start;
    delete node.end;
    delete node.loc;
    _.values(node).forEach(child => {
      if (_.isArray(child) || _.isObject(child)) cleannode(child);
    });
  }
  if(_.isArray(node)) {
    node.forEach(cleannode);
  }
  return node;
}

function safeCleanParse(text, clean) {
  try {
    const ast = parse(text, { sourceType: "module"});
    return clean ? cleannode(ast.program.body) : ast.program.body;
  }
  catch(error) {
    const safe = {"status": "syntax error!"}
    return safe;
  }
}

function AST() {
  const [text, setText] = useState('');
  const [clean, setClean] = useState(true);
  const ast = safeCleanParse(text, clean);
  return (<div id="srcs-ast">
    <span>
      <input type="checkbox"
        checked={clean}
        onChange={e => setClean(!clean)}
      />
      Clean
    </span>
    <textarea
      rows={5}
      cols={100}
      value={text}
      onChange={e => setText(e.target.value)}
    />
    <SyntaxHighlighter language='javascript' style={docco}>
      {text}
    </SyntaxHighlighter>
    <ReactJson
      src={ast}
      collapsed={1}
      displayDataTypes={false}
    />
  </div>);
}

export default AST;
