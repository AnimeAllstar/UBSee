import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import NotFound from './components/NotFound';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/subject/CPSC" />
          </Route>
          <Route exact path="/subject/:subject/course/:course" children={<App />} />
          <Route exact path="/subject/:subject" children={<App />} />
          <Route path="*" children={<NotFound />} />
        </Switch>
      </Router>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
