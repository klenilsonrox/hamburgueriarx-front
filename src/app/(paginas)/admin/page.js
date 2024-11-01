import ProdutosAdmin from '@/app/components/AdminPainel';
import ProductManagement from '@/app/components/ProdutosAdmin';
import React from 'react';

const page = () => {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* <ProdutosAdmin /> */}
      <ProductManagement />
    </div>
  );
};

export default page;