'use client'
import Link from 'next/link';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import React, { useState } from 'react';
import { FaRegUser } from "react-icons/fa";
import { useUserContext } from '../contexts/UserContext';
import { logout } from '../actions/logout';

const itemsMenu = [
    { id: 1, name: "Início", link: "/" },
    { id: 2, name: "Cardápio", link: "/cardapio" },
];

const Menu = () => {
    const [menuConfig, setMenuConfig] = useState(false);
    const { user } = useUserContext();

    function closeMenuConfig() {
        setMenuConfig(false);
    }

    const handleLogout = async () => {
        await logout();
        window.location.reload();
    };

    return (
        <div className='border-b py-3 bg-white shadow-md'>
            <header className="p-4 max-w-7xl mx-auto w-full flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-red-600">Hamburgueria <span className='text-red-500'>RX</span></Link>

                <div className='hidden lg:flex items-center gap-6'>
                    <ul className='flex space-x-6'>
                        {itemsMenu.map((item) => (
                            <li key={item.id}>
                                <Link href={item.link} className='text-gray-700 hover:text-red-600 transition duration-300'>{item.name}</Link>
                            </li>
                        ))}
                        {!user && (
                            <>
                                <li>
                                    <Link href="/auth/entrar" className='text-gray-700 hover:text-red-600 transition duration-300'>Entrar</Link>
                                </li>
                                <li>
                                    <Link href="/auth/cadastrar" className='text-gray-700 hover:text-red-600 transition duration-300'>Cadastrar</Link>
                                </li>
                            </>
                        )}
                        {user && (
                            <li className='cursor-pointer' onClick={handleLogout}>
                                <span className='text-gray-700 hover:text-red-600 transition duration-300'>Sair</span>
                            </li>
                        )}
                    </ul>

                    {user && (
                        <div className='relative'>
                            <button onClick={() => setMenuConfig(!menuConfig)} className='text-red-600 text-2xl hover:text-red-800 transition duration-300'>
                                <FaRegUser />
                            </button>
                            {menuConfig && (
                                <div className='absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-10 animaLeft'>
                                    <button className='absolute top-2 right-2' onClick={closeMenuConfig}>
                                        <AiOutlineClose className='text-gray-600 hover:text-red-600' />
                                    </button>
                                    <p className='px-4 py-2 text-lg font-medium text-gray-800'>Olá, {user.name}</p>
                                    <ul className='py-2'>
                                        <li><Link href="/conta/pedidos" className='block px-4 py-2 hover:text-red-500 transition duration-300'>Pedidos</Link></li>
                                        <li><Link href="/conta/dados-cadastrais" className='block px-4 py-2 hover:text-red-500 transition duration-300'>Meus dados</Link></li>
                                        <li className='block px-4 py-2 text-lg cursor-pointer hover:text-red-500 transition duration-300' onClick={handleLogout}>Sair</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Menu Mobile */}
                <div className='lg:hidden flex items-center'>
                    <button className='text-red-600 text-2xl' onClick={() => setMenuConfig(!menuConfig)}>
                        {menuConfig ? <AiOutlineClose /> : <AiOutlineMenu />}
                    </button>
                </div>
            </header>

            {/* Menu Mobile (quando menuConfig é true) */}
            {menuConfig && (
                <div className='lg:hidden bg-white border-t border-gray-200'>
                    <ul className='flex flex-col p-4 space-y-2'>
                        {itemsMenu.map((item) => (
                            <li key={item.id}>
                                <Link href={item.link} className='block text-gray-700 hover:text-red-600 transition duration-300'>{item.name}</Link>
                            </li>
                        ))}
                        {!user && (
                            <>
                                <li>
                                    <Link href="/auth/entrar" className='block text-gray-700 hover:text-red-600 transition duration-300'>Entrar</Link>
                                </li>
                                <li>
                                    <Link href="/auth/cadastrar" className='block text-gray-700 hover:text-red-600 transition duration-300'>Cadastrar</Link>
                                </li>
                            </>
                        )}
                        {user && (
                            <li className='cursor-pointer' onClick={handleLogout}>
                                <span className='block text-gray-700 hover:text-red-600 transition duration-300'>Sair</span>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Menu;
