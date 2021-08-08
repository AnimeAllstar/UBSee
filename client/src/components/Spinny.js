import React from 'react';
import { Spinner } from 'react-bootstrap';

// returns loading spinner
export const Spinny = () => {
  return (
    <div className="d-flex justify-content-center h-100">
      <Spinner className="my-auto" animation="grow" variant="warning" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};
