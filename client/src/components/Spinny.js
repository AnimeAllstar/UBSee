import React from 'react';
import { Spinner } from 'react-bootstrap';

const Spinny = () => {
  return (
    <div className="d-flex justify-content-center h-100">
      <Spinner className="my-auto" animation="grow" variant="warning" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default Spinny;
