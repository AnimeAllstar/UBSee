import React from 'react';

// returns an svg rectangle with fill='color' wrapped in an inline div
export const ColorBox = ({ color, children }) => {
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

// returns text next to ColorBox svg
const Text = ({ text }) => {
  return <span>&nbsp;{text}&nbsp;</span>;
};

ColorBox.Text = Text;
