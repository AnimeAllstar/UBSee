import React from 'react';

import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Graph from './components/Graph';
import { DataProvider } from './contexts/DataContext';
import { getYear } from './functions/utils';

// App
function App() {
  const { subject, course } = useParams();
  const year = getYear();

  return (
    <DataProvider subject={subject.toUpperCase()} course={course} year={year}>
      <Container fluid className="h-100 p-0 fixed-top">
        <Sidebar />
        <Graph />
      </Container>
    </DataProvider>
  );
}

export default App;
