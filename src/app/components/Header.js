'use client'
import React from 'react';
import Menu from './Menu';
import { UserProvider } from '../contexts/UserContext';


const Header = () => {
  return (
    <div>
      <UserProvider>
      <Menu />
      </UserProvider>
    </div>
  );
};

export default Header;