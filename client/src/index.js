import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import NotFound from './components/NotFound';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
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
  </React.StrictMode>,
  document.getElementById('root')
);
