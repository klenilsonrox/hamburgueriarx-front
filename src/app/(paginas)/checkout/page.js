import Checkout from '@/app/components/Checkout';
import Container from '@/app/components/Container';
import { CartProvider } from '@/app/contexts/CartContext';
import React from 'react';

const page = () => {
  return (
   <>
   <Container>
    <CartProvider>
        <Checkout />
    </CartProvider>
   </Container>
   </>
  );
};

export default page;