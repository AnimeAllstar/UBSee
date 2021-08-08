import React from 'react';

export const ListGroup = ({ children }) => {
  return <ul className="list-group">{children}</ul>;
};

export const Item = ({ children }) => {
  return <li className="list-group-item rounded-0">{children}</li>;
};

const Title = ({ children }) => {
  return <h6>{children}</h6>;
};

const Description = ({ children }) => {
  return <span>{children}</span>;
};

const Body = ({ children }) => {
  return <>{children}</>;
};

ListGroup.Item = Item;
Item.Title = Title;
Item.Description = Description;
Item.Body = Body;
