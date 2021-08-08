import React from 'react';
import { ReactDiagram } from 'gojs-react';
import { Col } from 'react-bootstrap';

import graphInitializer from '../functions/graph-initializer';
import { useData } from '../contexts/DataContext';
import Spinny from './Spinny';

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
