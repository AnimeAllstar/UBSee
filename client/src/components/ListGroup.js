import React from 'react';

// returns <ul> with list-group bootstrap class
export const ListGroup = ({ children }) => {
  return <ul className="list-group">{children}</ul>;
};

// returns <li> with list-group-item and rounded-0 bootstrap classes
export const Item = ({ children }) => {
  return <li className="list-group-item rounded-0">{children}</li>;
};

// returns Item.Title
const Title = ({ children }) => {
  return <h6>{children}</h6>;
};

// returns Item.Description
const Description = ({ children }) => {
  return <span>{children}</span>;
};

// returns Item.Body
const Body = ({ children }) => {
  return <>{children}</>;
};

ListGroup.Item = Item;
Item.Title = Title;
Item.Description = Description;
Item.Body = Body;
