import React from 'react';

// returns boostrap accordian Tab
export const Tab = ({ id, title, color, children }) => {
  return (
    <>
      <h2 className="accordion-header">
        <button className="accordion-button collapsed" style={{ color: color }} type="button" data-bs-toggle="collapse" data-bs-target={`#${id}`}>
          {title}
        </button>
      </h2>
      <div id={id} className="accordion-collapse collapse">
        <div className="accordion-body p-0">{children}</div>
      </div>
    </>
  );
};
