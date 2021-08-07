import React from 'react';

const NavBrand = () => {
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
          <a href="https://github.com/AnimeAllstar/UBSee" target="_blank">
            <i className="bi-github text-white" style={{ fontSize: '1.5em' }} />
          </a>
        </div>
      </div>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon" />
      </button>
    </div>
  );
};

export default NavBrand;