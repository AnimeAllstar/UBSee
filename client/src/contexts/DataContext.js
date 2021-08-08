import React, { useContext, useState, useEffect, useRef } from 'react';

import { getData } from '../functions/data-initializer';
import { getApiUrl, getRoute } from '../functions/utils';

const DataContext = React.createContext();

// returns useContext hook to access functions, variables provided by DataContext.Provider
export function useData() {
  return useContext(DataContext);
}

// returns DataProvider with value='value'
export function DataProvider({ subject, course, year, children }) {
  const [nodeDataArray, setNodeDataArray] = useState([]);
  const [linkDataArray, setLinkDataArray] = useState([]);
  const [isLoading, setLoading] = useState(true);

  // stores stateful data on the current graph
  const [currentGraph, setCurrentGraph] = useState({
    subject: subject,
    course: course,
    year: year,
    api: getApiUrl(subject, course, year),
    route: window.location.pathname + window.location.search,
  });

  const graphRef = useRef(null);

  // is called whenever there is a change in the graph model
  // currently does nothing, but useful for testing
  const handleModelChange = (changes) => {
    // console.log('GoJS model changed!');
    // console.log(changes);
  };

  // updates 'CurrentGraph' with new data
  // sets loading to true, causing the spinner to replace the graph
  const updateGraphState = (subject, course, year) => {
    setLoading(true);
    setCurrentGraph({
      subject: subject,
      course: course,
      year: year,
      api: getApiUrl(subject, course, year),
      route: getRoute(subject, course, year),
    });
  };

  // called when currentGraph is updated
  // changes url to currentGraph.route
  // fetches new data
  // sets setNodeDataArray and setLinkDataArray
  // sets loading to false, causing the graph to replace the spinner
  useEffect(() => {
    const setDataArrays = async () => {
      window.history.replaceState(null, '', currentGraph.route);

      const data = await getData({ ...currentGraph });
      setNodeDataArray(data.nodes);
      setLinkDataArray(data.links);
      setLoading(false);
    };
    setDataArrays();
  }, [currentGraph]);

  // object of functions/variables that are accessible using through DataContext.Provider
  const value = {
    nodeDataArray,
    linkDataArray,
    graphRef,
    isLoading,
    handleModelChange,
    updateGraphState,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
