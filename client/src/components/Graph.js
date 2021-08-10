import React from 'react';
import { ReactDiagram } from 'gojs-react';

import { Spinny } from './Spinny';
import { useData } from '../contexts/DataContext';
import graphInitializer from '../functions/graph-initializer';
import Error from './Error';

// if graph data is being fetched, return loading spinner
// otherwise, return GoJS diagram
const Graph = () => {
  const { isLoading, isError, nodeDataArray, linkDataArray, handleModelChange, graphRef } = useData();

  const renderGraph = () => {
    if (isError) {
      return <Error />;
    } else if (isLoading) {
      return <Spinny />;
    } else {
      return (
        <ReactDiagram
          ref={graphRef}
          initDiagram={graphInitializer}
          divClassName="graph-component"
          nodeDataArray={nodeDataArray}
          linkDataArray={linkDataArray}
          onModelChange={handleModelChange}
        />
      );
    }
  };

  return <div className="graph-container col-lg-9">{renderGraph()}</div>;
};

export default Graph;
