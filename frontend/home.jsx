import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import SyntaxHighlighter from 'react-syntax-highlighter';
import axios from "axios";

function Home() {
  const [item, setItem] = useState({});
  const [assessed, setAssessed] = useState(false);
  const fetchAnItem = (action, id) => {
    axios.get('/api/sr_item', {params: {action, id}})
      .then(response => { setItem(response.data)})
      .catch(error => console.log(error));
  };
  useEffect(()=>fetchAnItem(), [0]);
  if(!item.id) return <div />;
  return (<Container>
    <Row>
      <Col md={6}>
        <Card>
          <Card.Body>
            <Card.Title>{item.sheet.name}</Card.Title>
            <Card.Subtitle className="text-muted">{item.section.name}</Card.Subtitle>
            <Card.Text>{item.name}:</Card.Text>
            {!assessed ? <Button
              variant="primary"
              onClick={()=>setAssessed(true)}
            >Assess</Button> : null }
            {assessed ? (<>
              <SyntaxHighlighter>{item.shortcut}</SyntaxHighlighter>
              <Button
                variant="primary"
                onClick={() => {
                  setAssessed(false);
                  fetchAnItem();
                }}
              >
                  Continue
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setAssessed(false);
                  fetchAnItem('remove', item.sr_id);
                }}
              >
                Remove and continue
              </Button>
            </>): null}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>);
}

export default Home;
