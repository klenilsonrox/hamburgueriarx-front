import Container from '@/app/components/Container';
import Login from '@/app/components/Login';
import { UserProvider } from '@/app/contexts/UserContext';
import React from 'react';

const page = () => {
  return (
    <Container>
      <UserProvider>
     <Login />
     </UserProvider>
    </Container>
  );
};

export default page;