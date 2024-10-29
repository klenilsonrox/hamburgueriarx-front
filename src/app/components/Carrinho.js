'use client';
import React, { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { FaMinus, FaPlus } from "react-icons/fa6";
import Link from 'next/link';


const Carrinho = () => {
  const { cart, aumentarQtd, diminuirQtd } = useCart();

  const finalizar = () => {
    const products = cart.map((item) => {
      return {
        id: item.productId,
        quantity: item.quantity,
        observacao: item.observacao
      }
    });

  };

  useEffect(()=>{
    finalizar()
  },[cart])



  // Calcula o preço total do carrinho
  const totalPrice = cart.reduce((total, item) => total + item.quantity * item.price, 0);

  return (
    <div className='bg-white rounded-md p-2'>
      {cart.length === 0 ? (
        <div>
          <p>O carrinho está vazio.</p>
          <Link href="/cardapio" className='text-red-500 font-bold'>Adicionar itens</Link>
        </div>
      ) : (
        <div>
          {/* Exibe o preço total do carrinho */}
          <div className="mb-4">
            <span className="text-lg font-semibold">Preço total: R$ {Number(totalPrice).toFixed(2)}</span>
          </div>

         <div className='max-h-[300px] lg:max-h-[500px] overflow-y-scroll my-4'>
         {cart.map((item) => (
            <div key={item.productId} className="mb-4 p-4 border rounded-md shadow-sm ">
              <div className='flex justify-between items-start'>
                <img src={item.imageUrl} alt={`imagem do ${item.title}`} className='w-[80px] h-[80px] object-cover rounded-md' />
                <div className='pl-2 w-[200px] truncate'>
                  <p><span className='font-medium'>{item.quantity}</span>x - <span>{item.title}</span></p>
                  <p>Preço unitário: R$ {Number(item.price).toFixed(2)}</p>
                  <p>Observação: {item.observacao || 'Nenhuma observação'}</p>
                </div>

                <div className="flex lg:flex-row lg:space-x-4 flex-col justify-center items-center mt-2">
                  <button
                    onClick={() => diminuirQtd(item.productId)}
                 className='text-red-600 border p-1 rounded'
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => aumentarQtd(item.productId)}
                   className='border p-1 rounded'
                  >
                    <FaPlus/>
                  </button>
                </div>
              </div>
            </div>
          ))}
         </div>
          <div className='flex  fixed right-0 left-0 py-6 bottom-0 border-t'>
            <div className='w-full mx-auto  max-w-7xl'>
             <p className='text-center'>Selecione o tipo de serviço</p>
             <div className='mx-auto flex gap-4 mt-4 max-w-lg items-center px-4'>
              <Link href="/cardapio" className='px-8'>voltar</Link>
              <button className='flex-1 bg-[#F62626]  text-white py-3 rounded-md'>BUSCAR</button>
            <Link href="/delivery" className='flex-1 bg-[#F62626]  text-white py-3 rounded-md text-center'>DELIVERY</Link>
             </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrinho;
