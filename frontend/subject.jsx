import React, { useState, useEffect, Component } from "react";
import { Route, NavLink } from "react-router-dom";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import axios from "axios";


function Scripts(props) {
  const [scripts, setScripts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState('');
  useEffect(() => {
    axios
      .get("/api/scripts", {
          params: props
        })
      .then(response => {
        setScripts(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [props.subject]);
  const hide = () => setShowModal(false);
  return (<div>
    <Table>
      <thead>
        <tr>
          <th>Script</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {scripts.map(script => {
          return (<tr key={script.token}>
            <td>{script.name}</td>
            <td>
              <Button onClick={() => {
                axios.get("/api/script", {
                  params: { id: script.id }
                }).then(response => {
                  setText(response.data.text);
                  setShowModal(true);
                })
                .catch(error => {
                  console.log(error);
                });
              }}>View</Button>
            </td>
          </tr>);
        })}
      </tbody>
    </Table>
    <Modal show={showModal} onHide={hide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Script</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div style={{height:600, overflowY: "scroll"}}>
          <SyntaxHighlighter language={'python'} style={docco}>
            {text}
          </SyntaxHighlighter>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={hide}>Close</Button>
      </Modal.Footer>
    </Modal>
  </div>);
}

function Repositories() {
  return <div />;
}

const Subject = ({match}) => {
  const { subject } = match.params;
  return (<div>
    <Nav variant="tabs">
      <Nav.Item>
        <Nav.Link to={`${match.url}/scripts`} as={NavLink}>Scripts</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link to={`${match.url}/repos`} as={NavLink}>Repositories</Nav.Link>
      </Nav.Item>
    </Nav>
    <div style={{marginTop: 10}}>
      <Route path={`${match.path}/scripts`} render={props => <Scripts {...match.params} />} />
      <Route path={`${match.path}/repos`} component={Repositories}/>
    </div>
  </div>);
}

export default Subject;
