import Carrinho from "@/app/components/Carrinho";
import Container from "@/app/components/Container";
import Header from "@/app/components/Header";
import { CartProvider } from "@/app/contexts/CartContext";

import React from 'react';

const page = () => {
  return (
   <div>
    <CartProvider>
    <Header />
     <Container >
     <Carrinho />
    </Container>
    </CartProvider>
   </div>
  );
};

export default page;