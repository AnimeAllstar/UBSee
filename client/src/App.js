// App.js
import React from 'react';
import { Container } from 'react-bootstrap';

import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import Sidebar from './components/Sidebar';
import Graph from './components/Graph';
import { useParams } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { getYear } from './functions/utils';

// render function...
function App() {
  const { subject, course } = useParams();
  const year = getYear();

  return (
    <DataProvider subject={subject} course={course} year={year}>
      <Container fluid className="h-100 p-0 fixed-top">
        <Sidebar />
        <Graph />
      </Container>
    </DataProvider>
  );
}

export default App;
