import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ReactJson from 'react-json-view'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { parseModule, parseScript } from "esprima";
import axios from "axios";


function Tokenizer() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tokens, setTokens] = useState([]);
  const [expand, setExpand] = useState(3);

  const onJSTextChange = e => {
      const new_text = e.target.value;
      setText(new_text);
      setTokens(parseModule(new_text, { tokens: true }).tokens);
    },
    onPythonTextChange = e => {
      setText(e.target.value);
    },
    fetchPythonAST = clean => {
      axios.post('/api/tokenize_python', {
        code: text
      }).then(response => {
        console.log(response);
        setTokens(response.data);
      });
    },
    is_javascript = language == 'javascript',
    onTextChange = is_javascript ? onJSTextChange : onPythonTextChange;
  return (<div id="srcs-ast">

    <span style={{display: "flex", alignItems: "center", marginBottom: 20}}>
      <span className="toolbar-item">
        <label className="toolbar-label">Language</label>
        <select
          style={{width: 200, marginLeft: 5}}
          value={language}
          onChange={e => {
            setLanguage(e.target.value)
            setText('');
            setTokens([]);
          }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
      </span>

      <span className="toolbar-item">
        <label className="toolbar-label">Expand</label>
        <input
          type="number"
          min="1"
          value={expand}
          style={{width: 50}}
          onChange={e => setExpand(e.target.value)}
        />
      </span>

      {language == 'python' ? (<Button
        className="toolbar-item"
        onClick={fetchPythonAST}
      >
        Tokenize
      </Button>) : null }
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

    <div style={{ height: 550, overflowY: "scroll" }}>
      <ReactJson
        src={tokens}
        displayDataTypes={false}
        collapsed={expand}
      />
    </div>
  </div>);
}

export default Tokenizer;
