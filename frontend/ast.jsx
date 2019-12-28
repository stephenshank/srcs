import React, { useState } from 'react';
import { parse } from '@babel/parser';
import ReactJson from 'react-json-view'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import axios from "axios";
import _ from "underscore";


function cleanJSNode(node) {
  if(_.isObject(node)) {
    delete node.start;
    delete node.end;
    delete node.loc;
    _.values(node).forEach(child => {
      if (_.isArray(child) || _.isObject(child)) cleanJSNode(child);
    });
  }
  if(_.isArray(node)) {
    node.forEach(cleanJSNode);
  }
  return node;
}

function safeCleanJSParse(text, clean) {
  try {
    const ast = parse(text, { sourceType: "module" });
    return clean ? cleanJSNode(ast.program.body) : ast.program.body;
  }
  catch(error) {
    const safe = {"status": "syntax error!"}
    return safe;
  }
}

function cleanPythonNode(node, clean) {
  if(!clean) return node;
  if(_.isObject(node)) {
    delete node.col_offset;
    delete node.level;
    delete node.lineno;
    _.values(node).forEach(child => {
      if (_.isArray(child) || _.isObject(child)) cleanPythonNode(child, clean);
    });
  }
  if(_.isArray(node)) {
    node.forEach(cleanPythonNode);
  }
  return node;
}

function AST() {
  const [text, setText] = useState('');
  const [clean, setClean] = useState(true);
  const [language, setLanguage] = useState('python');
  const [ast, setAst] = useState({});

  const onJSTextChange = e => {
      const new_text = e.target.value;
      setText(new_text);
      setAst(safeCleanJSParse(new_text, clean));
    },
    onPythonTextChange = e => {
      setText(e.target.value);
    },
    fetchPythonAST = clean => {
      axios.post('/api/python_ast', {
        code: text 
      }).then(response => {
        setAst(cleanPythonNode(response.data.body, clean));
      });
    },
    onPythonCleanChange = e => {
      setClean(!clean);
      fetchPythonAST(!clean);
    },
    onJSCleanChange = e => {
      setClean(!clean);
      setAst(safeCleanJSParse(text, !clean));
    },
    is_javascript = language == 'javascript',
    onTextChange = is_javascript ? onJSTextChange : onPythonTextChange,
    onCleanChange = is_javascript ? onJSCleanChange : onPythonCleanChange;
  return (<div id="srcs-ast">
    <span>
      <input type="checkbox"
        checked={clean}
        onChange={onCleanChange}
      />
      Clean
      <span style={{marginLeft: 20}}>
        <label>Language</label>
        <select
          style={{width: 200, marginLeft: 5}}
          value={language}
          onChange={e => {
            setLanguage(e.target.value)
            setText('');
            setAst({});
          }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
      </span>

      {language == 'python' ? (<button
        style={{marginLeft: 20}}
        onClick={fetchPythonAST}
      >
        Parse AST
      </button>) : null } 
    </span>
    <textarea
      rows={5}
      cols={100}
      value={text}
      onChange={onTextChange}
    />
    <SyntaxHighlighter language={language} style={docco}>
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
