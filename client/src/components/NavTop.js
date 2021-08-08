import React from 'react';
import { Github } from 'react-bootstrap-icons';

// returns website Title, Link to Github via an icon and hamburger menu button
const NavTop = () => {
  return (
    <div className="d-flex justify-content-between px-2">
      <div className="d-flex align-items-center">
        <div className="flex-shrink-0 mx-1 mt-2">
          <h1 className="text-white">
            <a href="/" className="text-white text-decoration-none">
              UBSee
            </a>
          </h1>
        </div>
        <div className="flex-grow-1 ms-3">
          <a href="https://github.com/AnimeAllstar/UBSee" target="_blank" rel="noreferrer">
            <Github color="white" style={{ fontSize: '1.5em' }} />
          </a>
        </div>
      </div>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon" />
      </button>
    </div>
  );
};

export default NavTop;
