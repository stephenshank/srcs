import React from "react";
import Nav from "react-bootstrap/Nav";
import { NavLink as RBNavLink} from "react-router-dom";

function NavLink(props) {
  return (<Nav.Item>
    <Nav.Link to={props.to} as={RBNavLink}>{props.label}</Nav.Link>
  </Nav.Item>);
}

export { NavLink };
