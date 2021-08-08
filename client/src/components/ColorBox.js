import React from 'react';

const ColorBox = ({ color, children }) => {
  return (
    <div className="d-inline-block">
      <svg width={20} height={20}>
        <rect
          width={20}
          height={20}
          style={{
            fill: color,
            strokeWidth: 3,
            stroke: 'rgb(0,0,0)',
          }}
        />
      </svg>
      {children}
    </div>
  );
};

const Text = ({ text }) => {
  return <span>&nbsp;{text}&nbsp;</span>;
};

ColorBox.Text = Text;

export default ColorBox;
