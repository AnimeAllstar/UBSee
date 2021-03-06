import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import * as go from 'gojs';

import { Tab } from '../Tab';
import { Item, ListGroup } from '../ListGroup';
import { useData } from '../../contexts/DataContext';

// Preferences Tab in ../Tabs
const Preferences = () => {
  const [direction, setDirection] = useState(0);
  const [layering, setLayering] = useState(0);

  const { graphRef } = useData();

  // sets graph.layout.layeringOption
  const setLayeringOption = () => {
    const graph = graphRef.current.getDiagram();
    if (layering === 0) {
      graph.layout.layeringOption = go.LayeredDigraphLayout.LayerLongestPathSource;
    } else if (layering === 1) {
      graph.layout.layeringOption = go.LayeredDigraphLayout.LayerLongestPathSink;
    } else if (layering === 2) {
      graph.layout.layeringOption = go.LayeredDigraphLayout.LayerOptimalLinkLength;
    }
  };

  // updates graph preferences (direction, layering)
  const updatePreferences = () => {
    const graph = graphRef.current.getDiagram();
    graph.startTransaction('update preferences');
    setLayeringOption();
    graph.layout.direction = direction;
    graph.commitTransaction('update preferences');
  };

  return (
    <Tab id="preferences-tab" title="Preferences">
      <ListGroup>
        {/* Graph Direction Form. Updates 'direction' variable */}
        <ListGroup.Item>
          <Item.Title>Direction</Item.Title>
          <Item.Description>Select the direction of the graph</Item.Description>
          <br />
          <Item.Body>
            <Form.Check inline label="Right" name="direction" type="radio" onClick={() => setDirection(0)} defaultChecked />
            <Form.Check inline label="Down" name="direction" type="radio" onClick={() => setDirection(90)} />
            <Form.Check inline label="Left" name="direction" type="radio" onClick={() => setDirection(180)} />
            <Form.Check inline label="Up" name="direction" type="radio" onClick={() => setDirection(270)} />
          </Item.Body>
        </ListGroup.Item>
        {/* Graph Layering Form. Updates 'layering' variable */}
        <ListGroup.Item>
          <Item.Title>Layering</Item.Title>
          <Item.Description>Select the layering style of the graph</Item.Description>
          <br />
          <Item.Body>
            <Form.Check inline label="Longest path from source" name="layering" type="radio" onClick={() => setLayering(0)} defaultChecked />
            <Form.Check inline label="Longest path to sink" name="layering" type="radio" onClick={() => setLayering(2)} />
            <Form.Check inline label="Optimal link length" name="layering" type="radio" onClick={() => setLayering(3)} />
          </Item.Body>
        </ListGroup.Item>
        {/* Calls updatePreferences */}
        <ListGroup.Item>
          <Button variant="outline-primary" onClick={updatePreferences}>
            Update
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </Tab>
  );
};

export default Preferences;
