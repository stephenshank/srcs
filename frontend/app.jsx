import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import * as brandIcons from "@fortawesome/free-brands-svg-icons";
import axios from "axios";

import Home from "./home.jsx";
import AST from "./ast.jsx";
import Subject from "./subject.jsx";

import "./styles/main.scss";

const Icons = Object.assign({}, solidIcons, brandIcons);

function Link(props) {
  return (
    <li className="nav-item">
      <NavLink
        to={props.to}
        className="nav-link"
        activeClassName="active"
        exact
      >
        <FontAwesomeIcon key={1} icon={Icons[props.icon]} className="srcs-fa" />
        {props.label}
      </NavLink>
    </li>
  );
}

function Main(props) {
  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
    if(subjects.length > 0) { return; }
    axios
      .get("/api/subjects")
      .then(response => {
        setSubjects(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  });
  return (
    <BrowserRouter>
      <div>
        <title>Spaced Repetition Cheat Sheet</title>
        <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://getbootstrap.com/docs/4.0/examples/dashboard/#"
          >
            Spaced Repetition Cheat Sheet
          </a>
          <input
            className="form-control form-control-dark w-100"
            type="text"
            placeholder="Search"
            aria-label="Search"
          />
        </nav>
        <div className="container-fluid">
          <div className="row">
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
              <div className="sidebar-sticky">
                <ul className="nav flex-column">
                  <Link to="/" label="Home" icon="faHome" />
                  <Link to="/ast" label="AST" icon="faProjectDiagram" />
                </ul>
                <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                  <span>Subjects</span>
                </h6>
                <ul className="nav flex-column mb-2">
                  {subjects.map(subject => {
                    return (
                      <Link
                        key={subject.token}
                        to={"/" + subject.token}
                        label={subject.name}
                        icon={subject.icon}
                      />
                    );
                  })}
                </ul>
              </div>
            </nav>
            <main
              role="main"
              className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4"
            >
              <Route exact path="/" component={Home} />
              <Route path="/ast" component={AST} />
              {subjects.map(subject => {
                return (
                  <Route
                    path={"/" + subject.token}
                    key={subject.token}
                    render={props => <Subject title={subject.name} />}
                  />
                );
              })}
            </main>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <Main />,
  document.body.appendChild(document.createElement("div"))
);