import React, { useContext, useState, useEffect } from 'react';
import { getData } from '../utils/data-initializer';

const DataContext = React.createContext();

export function useData() {
  return useContext(DataContext);
}

function getApiData() {
  const splitUrl = window.location.pathname.split('/');
  const subject = splitUrl[2];
  const course = splitUrl[4];
  const urlParams = new URLSearchParams(window.location.search);
  const nodes = urlParams.get('nodes');
  const queryString = course ? `?nodes=${nodes}` : window.location.search;
  return {
    subject: subject,
    course: course,
    url: `api/subject/${subject}${queryString}`,
  };
}

export function DataProvider({ children }) {
  const [nodeDataArray, setNodeDataArray] = useState([]);
  const [linkDataArray, setLinkDataArray] = useState([]);
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
      console.log(data.nodes);
      console.log(data.links);
    };
    setData();
  }, []);

  /**
   * This function handles any changes to the GoJS model.
   * It is here that you would make any updates to your React state, which is dicussed below.
   */
  const handleModelChange = (changes) => {
    console.log('GoJS model changed!');
    console.log(changes);
  };

  const value = {
    nodeDataArray,
    linkDataArray,
    isLoading,
    handleModelChange,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
