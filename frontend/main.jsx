import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import axios from "axios";
import "bootstrap";

import Home from "./home.jsx";
import Subject from "./subject.jsx";

import "bootstrap/dist/css/bootstrap.min.css";


function Link(props) {
  return (
    <NavLink className="dropdown-item link" to={props.to}>
      {props.header}
    </NavLink>
  );
}

function Dropdown(props) {
  return (
    <ul className="navbar-nav ">
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {props.title}
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          {props.children}
        </div>
      </li>
    </ul>
  );
}

function Divider() {
  return (<div className="dropdown-divider"></div>);
}

function Navbar(props) {
  return (<nav className="navbar navbar-expand-lg navbar-light bg-light">
    <NavLink className="navbar-brand" to="/">
     Spaced Repetition Cheat Sheet 
    </NavLink>
    <Dropdown title="Subjects">
      {props.subjects.map(subject => { 
        return (<Link
          to={subject.token}
          header={subject.name}
          key={subject.token}
        />);
      })}
    </Dropdown>
  </nav>);
}

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
        <Navbar subjects={this.state.subjects} />
        <div style={{ maxWidth: 1140 }} className="container-fluid">
          <Route exact path="/" component={Home} />
          {this.state.subjects.map(subject => {
            return (<Route
              path={"/" + subject.token}
              key={subject.token}
              render={props => <Subject title={subject.name} />}
            />);
          })}
        </div>
      </div>
    </BrowserRouter>);
  }
}

ReactDOM.render(
  <Main />,
  document.body.appendChild(document.createElement("div"))
)

