'use client'
import React from 'react';

const Container = ({children}) => {
  return (
    <div className="p-4 max-w-7xl mx-auto min-h-screen">
      {children}
    </div>
  );
};

export default Container;