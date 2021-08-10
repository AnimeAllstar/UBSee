import React, { useContext, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { getData } from '../functions/data-initializer';
import { getApiUrl, getRoute, getTitle } from '../functions/utils';

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
  const [isError, setError] = useState(false);
  const [isPrev, setPrev] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState(null);
  const history = useHistory();

  const [head, setHead] = useState(getTitle(subject, course));

  // stores stateful data on the current graph
  const [currentGraph, setCurrentGraph] = useState({
    subject: subject,
    course: course,
    year: year,
    api: getApiUrl(subject, course, year),
    route: window.location.pathname + window.location.search,
  });

  const graphRef = useRef(null);

  // ensures that clicking the back button in browser rerenders the graph
  // uses the state of the event to update the graph's state
  window.onpopstate = (event) => {
    const prevState = event.state.state;
    if (prevState) {
      const prevGraph = prevState.graph;
      setPrev(true);
      updateGraphState(prevGraph.subject, prevGraph.course, prevGraph.year, prevGraph);
    }
  };

  // is called whenever there is a change in the graph model
  // currently does nothing, but useful for testing
  const handleModelChange = (changes) => {
    // console.log('GoJS model changed!');
    // console.log(changes);
  };

  // updates 'CurrentGraph' with new data
  // sets loading to true, causing the spinner to replace the graph
  const updateGraphState = (subject, course, year, obj) => {
    setLoading(true);
    setError(false);
    if (obj) {
      setCurrentGraph(obj);
    } else {
      const subjectCaps = subject.toUpperCase();
      setCurrentGraph({
        subject: subjectCaps,
        course: course,
        year: year,
        api: getApiUrl(subjectCaps, course, year),
        route: getRoute(subjectCaps, course, year),
      });
    }
  };

  const handleError = (e) => {
    if (!isError) {
      const t = e.message.split(' ').length < 5 ? e.message : 'Error';
      setHead({ title: `${t} | UBSee` });
      console.error(e);
      setErrorMessage(e.message);
      setError(true);
    }
  };

  // called when currentGraph is updated
  // changes url to currentGraph.route
  // fetches new data
  // sets setNodeDataArray and setLinkDataArray
  // sets loading to false, causing the graph to replace the spinner
  useEffect(() => {
    const setDataArrays = async () => {
      // isPrev ensures that if the back button is clicked, a new state is not pushed to history
      if (isPrev) {
        setPrev(false);
      } else {
        // pushes the new route as well as state. the state is used by window.onpopstate to re render the page
        history.push(currentGraph.route, {
          graph: currentGraph,
        });
      }

      setHead(getTitle(currentGraph.subject, currentGraph.course));

      try {
        const data = await getData({ ...currentGraph });
        setNodeDataArray(data.nodes);
        setLinkDataArray(data.links);
        setLoading(false);
      } catch (e) {
        handleError(e);
      }
    };
    setDataArrays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGraph]);

  // object of functions/variables that are accessible using through DataContext.Provider
  const value = {
    currentGraph,
    nodeDataArray,
    linkDataArray,
    graphRef,
    isLoading,
    isError,
    ErrorMessage,
    handleError,
    handleModelChange,
    updateGraphState,
  };

  return (
    <DataContext.Provider value={value}>
      <Helmet>{<title>{head.title}</title>}</Helmet>
      {children}
    </DataContext.Provider>
  );
}
