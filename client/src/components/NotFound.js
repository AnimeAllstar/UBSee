import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <div className="container-fluid m-3">
      <Helmet>{<title>404 - Page Not Found | UBSee</title>}</Helmet>
      <h1 className="text-start fw-bold mb-4">
        404
        <br />
        Page Not found
      </h1>
      <Link to="/" className="m-1">
        <Button variant="primary">Home</Button>
      </Link>

      <a href="https://github.com/AnimeAllstar/UBSee" target="_blank" className="m-1" rel="noreferrer">
        <Button variant="dark">Github</Button>
      </a>
    </div>
  );
};

export default NotFound;
