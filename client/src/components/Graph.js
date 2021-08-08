import React from 'react';
import { ReactDiagram } from 'gojs-react';
import { Col } from 'react-bootstrap';

import { Spinny } from './Spinny';
import { useData } from '../contexts/DataContext';
import graphInitializer from '../functions/graph-initializer';

// if graph data is being fetched, return loading spinner
// otherwise, return GoJS diagram
const Graph = () => {
  const { isLoading, nodeDataArray, linkDataArray, handleModelChange, graphRef } = useData();

  return (
    <Col lg="9" className="graph-container">
      {isLoading ? (
        <Spinny />
      ) : (
        <ReactDiagram
          ref={graphRef}
          initDiagram={graphInitializer}
          divClassName="graph-component"
          nodeDataArray={nodeDataArray}
          linkDataArray={linkDataArray}
          onModelChange={handleModelChange}
        />
      )}
    </Col>
  );
};

export default Graph;
