import Delivery from '@/app/components/Delivery';
import Header from '@/app/components/Header';
import { CartProvider } from '@/app/contexts/CartContext';
import React from 'react';

const page = () => {
  return (
    <div >
       <CartProvider>
       <Header />
       <div className='w-full max-w-7xl mx-auto p-4'>
       </div>
       <Delivery />
       </CartProvider>
    </div>
  );
};

export default page;