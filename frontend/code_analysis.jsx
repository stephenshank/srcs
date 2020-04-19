import React, { useState } from 'react';
import Nav from "react-bootstrap/Nav";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import AST from "./ast.jsx";
import Tokenizer from "./tokenizer.jsx";
import { NavLink } from "./utils.jsx";

function CodeAnalysis(props) {
  const match = useRouteMatch(),
    { tool } = match.params;
  return (<div>
    <Nav variant="tabs" defaultActiveKey="/home">
      <NavLink to={`/code-analysis/ast`} label='AST' />
      <NavLink to={`/code-analysis/tokenizer`} label='Tokenizer' />
    </Nav>
    <Switch>
      <Route path={`/code-analysis/ast`}>
        <AST />
      </Route>
      <Route path={`/code-analysis/tokenizer`}>
        <Tokenizer />
      </Route>
    </Switch>
  </div>);
}

export default CodeAnalysis;
