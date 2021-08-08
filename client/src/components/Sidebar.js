import React from 'react';

import Message from './Message';
import NavTop from './NavTop';
import Tabs from './Tabs';

// returns sidebar component
const Sidebar = () => {
  return (
    <nav className="sidebar navbar navbar-expand-lg d-block navbar-dark bg-dark col-lg-3">
      <NavTop />
      <div className="collapse navbar-collapse px-2 mt-3" id="navbarNav">
        <ul className="m-0 p-0 w-100">
          <li className="nav-item d-block">
            <Tabs />
          </li>
          <li className="mt-2 nav-item d-block">
            <Message />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
