import React, { useState } from 'react';
import { Tab } from '../Tab';
import { Item, ListGroup } from '../ListGroup';
import { Button, InputGroup, FormControl, Form } from 'react-bootstrap';
import { useData } from '../../contexts/DataContext';
import { updateDataForAll } from '../../functions/node-event-handler';

const Tools = () => {
  const [search, setSearch] = useState('');
  const [checkBoxes, setcheckBoxes] = useState({ 1: true, 2: true, 3: true, 4: true });
  const { graphRef } = useData();

  const searchGraph = () => {
    if (search) {
      // search key and title data property of all nodes using regex made using searchString
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safe, 'i');
      const results = graphRef.current.getDiagram().findNodesByExample(
        {
          key: regex,
        },
        {
          title: regex,
        }
      );

      // update isSearched data property of results collection (method from node-even-handler.js)
      updateDataForAll(results, 'isSearched', true, 'set isSearched to true');
    }
  };

  const clearSelection = () => {
    const searchedNodes = graphRef.current.getDiagram().findNodesByExample({
      isSearched: true,
    });
    // since isSearched is bound to scale (see graph-initializer), setting it to false, returns scale to normal
    updateDataForAll(searchedNodes, 'isSearched', false, 'set isSearched to false for searched nodes');
  };

  const updateFocus = () => {
    if (checkBoxes) {
      const graph = graphRef.current.getDiagram();
      graph.startTransaction('opacity');
      graph.nodes.each((node) => {
        const shape = node.findObject('shape');
        shape.opacity = 1.0;
        for (const year in checkBoxes) {
          if (!checkBoxes[year]) {
            console.log();
            if (node.data.key.split(' ')[1].substring(0, 1) === year) {
              shape.opacity = 0.4;
              break;
            }
          }
        }
      });
      graph.commitTransaction('opacity');
    }
  };

  return (
    <Tab title="Tools" id="tools-tab">
      <ListGroup>
        {/* Search */}
        <ListGroup.Item>
          <Item.Title>Search</Item.Title>
          <Item.Description>Search for a node within the graph.</Item.Description>
          <Item.Body>
            <InputGroup className="my-2">
              <FormControl value={search} placeholder="Enter search string" onChange={(e) => setSearch(e.target.value)} />
              <Button variant="outline-primary" onClick={searchGraph}>
                Search
              </Button>
              <Button variant="outline-primary" onClick={clearSelection}>
                Clear
              </Button>
            </InputGroup>
          </Item.Body>
        </ListGroup.Item>
        {/* Focus */}
        <ListGroup.Item>
          <Item.Title>Focus</Item.Title>
          <Item.Description>Select year levels you want to focus on.</Item.Description>
          <Item.Body>
            <Form>
              <div className="my-1">
                {[1, 2, 3, 4].map((num) => {
                  return (
                    <Form.Check
                      key={num}
                      inline
                      label={`year ${num}`}
                      name="focus"
                      type="checkbox"
                      defaultChecked={checkBoxes[num]}
                      onClick={() => {
                        setcheckBoxes({ ...checkBoxes, [num]: !checkBoxes[num] });
                      }}
                    />
                  );
                })}
              </div>
            </Form>
          </Item.Body>
        </ListGroup.Item>
        <ListGroup.Item>
          <Button variant="outline-primary" onClick={updateFocus}>
            Set Focus
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </Tab>
  );
};

export default Tools;
