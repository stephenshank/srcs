import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"

import Home from "./home.jsx";
import Subject from "./subject.jsx";


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: []
    };
  }
  componentDidMount() {
    this.initialize();
  }
  initialize = () => {
    axios.get("/api/subjects")
      .then(response => {
        this.setState({
          subjects: response.data
        });
      }).catch(error => {
        console.log(error);
      });
  }
  render() {
    return (<BrowserRouter>
      <div>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="/">Spaced-Repetition Cheat Sheet</Navbar.Brand>
          <Nav className="mr-auto">
            <NavDropdown title="Subject">
              {this.state.subjects.map(subject => { 
                return (<NavDropdown.Item
                  as={NavLink}
                  key={subject.token}
                  to={subject.token}
                >
                  {subject.name}
                </NavDropdown.Item>);
              })}
            </NavDropdown>
          </Nav>
        </Navbar>
        <Container>
          <Route exact path="/" component={Home} />
          {this.state.subjects.map(subject => {
            return (<Route
              path={"/" + subject.token}
              key={subject.token}
              render={props => <Subject title={subject.name} />}
            />);
          })}
        </Container>
      </div>
    </BrowserRouter>);
  }
}

ReactDOM.render(
  <Main />,
  document.body.appendChild(document.createElement("div"))
)

