import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

require('dotenv').config();

// this hook sends pageviews to google analytics if the app is not in development
// based on code from https://github.com/react-ga/react-ga/issues/122#issuecomment-668640145
const usePageTracking = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      ReactGA.initialize(process.env.REACT_APP_MEASUREMENT_ID);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      ReactGA.set({ page: location.pathname });
      ReactGA.send('pageview');
    }
  }, [initialized, location]);
};

export default usePageTracking;
