import Dados from '@/app/components/Dados';
import Header from '@/app/components/Header';
import React from 'react';

const page = () => {
  return (
    <>
    <Header />
    <div className="p-4 max-w-7xl mx-auto min-h-screen">
      <Dados />
    </div>
    </>
  );
};

export default page;