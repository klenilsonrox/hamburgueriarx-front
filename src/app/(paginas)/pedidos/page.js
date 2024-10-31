import Container from '@/app/components/Container';
import Header from '@/app/components/Header';
import MeusPedidos from '@/app/components/MeusPedidos';
import React from 'react';

const page = () => {
  return (
    <div>
        <Header />
      <Container>
        <MeusPedidos />
      </Container>
    </div>
  );
};

export default page;