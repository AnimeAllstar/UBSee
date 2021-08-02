// App.js
import React from 'react';
import { ReactDiagram } from 'gojs-react';
import { useEffect, useState } from 'react';

import graphInitializer from './utils/graph-initializer';
import { getData } from './utils/data-initializer';
import './App.css';

/**
 * This function handles any changes to the GoJS model.
 * It is here that you would make any updates to your React state, which is dicussed below.
 */
const handleModelChange = (changes) => {
  console.log('GoJS model changed!');
  console.log(changes);
};

// render function...
function App() {
  const [nodeDataArray, setNodeDataArray] = useState([]);
  const [linkDataArray, setLinkDataArray] = useState([]);

  useEffect(() => {
    const setData = async () => {
      const data = await getData({
        subject: '',
        course: '',
        api: 'api/subject/CPSC?year=undefined',
      });
      setNodeDataArray(data.nodes);
      setLinkDataArray(data.links);
      console.log(data.nodes);
      console.log(data.links);
    };
    setData();
  }, []);

  return (
    <ReactDiagram
      initDiagram={graphInitializer}
      divClassName="diagram-component"
      nodeDataArray={nodeDataArray}
      linkDataArray={linkDataArray}
      onModelChange={handleModelChange}
    />
  );
}

export default App;
