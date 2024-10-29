'use client'
import React, { useEffect } from 'react';
import ProdutosAdmin from './ProdutosAdmin';

const AdminPainel = () => {
    const [produtos,setProdutos] = React.useState([]);

    const getProdutos = async () => {
        const res = await fetch('/api/produtos');
        const data = await res.json();
        setProdutos(data.products);
    }

    useEffect(()=>{
        getProdutos()
    },[])

  return (
    <div>
      <ProdutosAdmin products={produtos}/>
    </div>
  );
};

export default AdminPainel;