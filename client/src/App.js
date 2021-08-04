// App.js
import React from 'react';
import { Container } from 'react-bootstrap';

import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import Graph from './components/Graph';

// render function...
function App() {
  return (
    <Container fluid className="h-100 p-0 fixed-top">
      <Sidebar />
      <Graph />
    </Container>
  );
}

export default App;
