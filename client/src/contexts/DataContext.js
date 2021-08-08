import React, { useContext, useState, useEffect, useRef } from 'react';
import { getData } from '../functions/data-initializer';

const DataContext = React.createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ subject, course, year, children }) {
  const [nodeDataArray, setNodeDataArray] = useState([]);
  const [linkDataArray, setLinkDataArray] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const getApiUrl = (s, c, y) => {
    if (s && c) {
      return `api/subject/${s}`;
    } else if (s) {
      return `api/subject/${s}?year=${y}`;
    }
  };

  const getRoute = (s, c, y) => {
    if (s && c) {
      return `/subject/${s}/course/${c}`;
    } else if (s) {
      return `/subject/${s}?year=${y}`;
    }
  };

  const [currentGraph, setCurrentGraph] = useState({
    subject: subject,
    course: course,
    year: year,
    api: getApiUrl(subject, course, year),
    route: window.location.pathname + window.location.search,
  });

  const graphRef = useRef(null);

  const handleModelChange = (changes) => {
    console.log(changes);
    console.log('GoJS model changed!');
  };

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
