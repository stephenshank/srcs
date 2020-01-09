import React, { useState, useEffect, Component } from "react";
import { Route, NavLink, Link, Switch, useRouteMatch, useParams } from "react-router-dom";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import axios from "axios";


function Scripts(props) {
  const [scripts, setScripts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('');
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
                  setLanguage(script.language)
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
          <SyntaxHighlighter language={language} style={docco}>
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


function AllSheets(props) {
  const match = useRouteMatch();
  return (<div>
    <Table>
      <thead>
        <tr>
          <th>Sheet</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {props.sheets.map(sheet=> {
          return (<tr key={sheet.id}>
            <td>
              <Link
                to={match.url + "/" + sheet.token}
              >
                {sheet.name}
              </Link>
            </td>
            <td>{sheet.description}</td>
          </tr>);
        })}
      </tbody>
    </Table>
  </div>);
}


function Sheet(props) {
  const { subject, sheetToken } = useParams();
  const [ sheet, setSheet ] = useState(null);
  useEffect(() => {
    axios
      .get("/api/sheet", {
          params: { token: sheetToken }
        })
      .then(response => {
        setSheet(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [sheetToken]);
  if (!sheet) return null;
  const header_style = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  };
  return (<Container>
    <Row>
      <Col md={12} style={header_style}>
        <h1>{sheet.name}</h1>
          <Link to={`/${subject}/sheets`}>Back to all sheets</Link>
      </Col>
    </Row>
    <Row>
      {sheet.sections.map(section => (<Col md={6}key={section.name}>
        <h3>{section.name}</h3>
        <Table striped hover>
          <thead>
            <tr>
              <th>Shortcut</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {section.items.map((item, i) => {
              return (<tr key={i}>
                <td>{item.shortcut}</td>
                <td>{item.name}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => {
                    axios.get('/api/add_sr_item', {params: {id: item.id}})
                      .catch(error => console.log(error));
                    }}
                  >
                    Flag
                  </Button>
                </td>
              </tr>);
            })}
          </tbody>
        </Table>
      </Col>))}
    </Row>
  </Container>);
}


function Sheets(){
  const [sheets, setSheets] = useState([]),
    match = useRouteMatch();
  useEffect(() => {
    axios
      .get("/api/sheets", {
          params: match.params
        })
      .then(response => {
        setSheets(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [match.params]);
  return (<>
    <Switch>
      <Route path={`${match.path}/:sheetToken`}>
        <Sheet />
      </Route>
      <Route path={`${match.path}`}>
        <AllSheets sheets={sheets}/>
      </Route>
    </Switch>
  </>)
}


function Subject() {
  const match = useRouteMatch(),
  { subject } = match.params;
  return (<div>
    <Nav variant="tabs">
      <Nav.Item>
        <Nav.Link to={`${match.url}/sheets`} as={NavLink}>Sheets</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link to={`${match.url}/scripts`} as={NavLink}>Scripts</Nav.Link>
      </Nav.Item>
    </Nav>
    <div style={{marginTop: 10}}>
      <Switch>
        <Route path={`${match.path}/sheets`}>
          <Sheets />
        </Route>
        <Route path={`${match.path}/scripts`}>
          <Scripts />
        </Route>
      </Switch>
    </div>
  </div>);
}

export default Subject;
