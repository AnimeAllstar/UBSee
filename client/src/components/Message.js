import React from 'react';

const Message = () => {
  return (
    <div className="alert alert-success rounded-0" role="alert">
      <h6 className="alert-heading">
        <i className="bi bi-exclamation-lg" /> Latest feature
      </h6>
      <p className="mb-0">
        <small>
          You can now <b>Search</b> for courses within a graph! Use the input field in the new <b>'Tools'</b> tab to search for nodes within a graph.
          <br />
          You can search using course code or titles. eg: 'econ 101', '101' 'Micro', 'Microecon', etc.
          <br />
          Click 'Clear' to clear all searches. You can also use ctrl + z and ctrl + y to undo and redo individual searches
        </small>
      </p>
    </div>
  );
};

export default Message;
