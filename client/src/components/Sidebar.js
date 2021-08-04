import React from 'react';
import { Col, Container, Navbar } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <Col lg="3" className="sidebar">
      <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <h1 className="text-white">Sidebar</h1>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Col>
  );
};

export default Sidebar;
