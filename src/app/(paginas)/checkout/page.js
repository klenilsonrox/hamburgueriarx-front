import Checkout from '@/app/components/Checkout';
import Container from '@/app/components/Container';
import Header from '@/app/components/Header';
import { CartProvider } from '@/app/contexts/CartContext';
import React from 'react';

const page = () => {
  return (
   <>
   <Header />
   <Container>
    <CartProvider>
        <Checkout />
    </CartProvider>
   </Container>
   </>
  );
};

export default page;