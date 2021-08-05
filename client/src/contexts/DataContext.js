import React, { useContext, useState, useEffect, useRef } from 'react';
import { getData } from '../utils/data-initializer';
import { getParam } from '../utils/utils';

const DataContext = React.createContext();

export function useData() {
  return useContext(DataContext);
}

function getApiData() {
  const splitUrl = window.location.pathname.split('/');
  const subject = splitUrl[2];
  const course = splitUrl[4];
  const queryString = course ? `?nodes=${getParam('nodes')}` : window.location.search;
  return {
    subject: subject,
    course: course,
    url: `api/subject/${subject}${queryString}`,
  };
}

export function DataProvider({ children }) {
  const [nodeDataArray, setNodeDataArray] = useState([]);
  const [linkDataArray, setLinkDataArray] = useState([]);
  const [skipsDiagramUpdate, setSkipsDiagramUpdate] = useState(false);
  const graphRef = useRef(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const setData = async () => {
      const apiData = getApiData();
      const data = await getData({
        subject: apiData.subject,
        course: apiData.course,
        api: apiData.url,
      });
      setNodeDataArray(data.nodes);
      setLinkDataArray(data.links);
      setLoading(false);
    };
    setData();
  }, []);

  const handleModelChange = (changes) => {
    console.log(changes);
    console.log('GoJS model changed!');
  };

  const value = {
    nodeDataArray,
    linkDataArray,
    skipsDiagramUpdate,
    graphRef,
    isLoading,
    handleModelChange,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
