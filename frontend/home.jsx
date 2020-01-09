import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
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
  return (<div>
    <h3>{item.sheet.name}</h3>
    <h4>{item.section.name}</h4>
    <p>{item.name}:</p>
    {!assessed ? <Button
      variant="primary"
      onClick={()=>setAssessed(true)}
    >Assess</Button> : null }
    {assessed ? (<>
      <p>{item.shortcut}</p>
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
          fetchAnItem('remove', item.id);
        }}
      >
          Remove and continue
      </Button>
    </>): null}
  </div>);
}

export default Home;
