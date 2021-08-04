import React, { useContext, useState, useEffect } from 'react';
import { getData } from '../utils/data-initializer';

const DataContext = React.createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [nodeDataArray, setNodeDataArray] = useState([]);
  const [linkDataArray, setLinkDataArray] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const setData = async () => {
      const data = await getData({
        subject: '',
        course: '',
        api: 'api/subject/CPSC?year=undefined',
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
