import React from 'react';

interface GridBackgroundProps {
  children: React.ReactNode;
}

/** Page wrapper. (It used to paint a decorative line grid behind the content; that overlay has been removed.) */
const GridBackground = ({ children }: GridBackgroundProps) => {
  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GridBackground;
