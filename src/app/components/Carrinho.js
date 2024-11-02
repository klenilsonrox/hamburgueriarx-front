'use client';
import React, { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { FaMinus, FaPlus } from "react-icons/fa6";
import { Minus, Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from '@/components/ui/button';

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
         <ScrollArea className="h-[calc(100vh-300px)]">
               {cart.map((item) => (
                 <div key={item.productId} className="p-4">
                   <div className="flex items-start space-x-4">
                     <img
                       src={item.imageUrl}
                       alt={item.title}
                       width={80}
                       height={80}
                       className="rounded-md object-cover"
                     />
                     <div className="flex-grow">
                       <h3 className="font-medium">{item.title}</h3>
                       <p className="text-sm text-gray-500">{item.observacao || 'Sem observações'}</p>
                       <div className="mt-2 flex items-center justify-between">
                         <span className="font-medium">R$ {item.price.toFixed(2)}</span>
                         <div className="flex items-center space-x-2">
                           <Button
                             variant="outline"
                             size="icon"
                             onClick={() => diminuirQtd(item.productId)}
                             className="h-8 w-8"
                           >
                             <Minus className="h-4 w-4" />
                           </Button>
                           <span className="w-8 text-center">{item.quantity}</span>
                           <Button
                             variant="outline"
                             size="icon"
                             onClick={() => aumentarQtd(item.productId)}
                             className="h-8 w-8"
                           >
                             <Plus className="h-4 w-4" />
                           </Button> 
                         </div>
                       </div>
                     </div>
                   </div>
                   <Separator className="my-4" />
                 </div>
               ))}
             </ScrollArea>
         </div>
          <div className='flex  fixed right-0 left-0 py-6 bottom-0 border-t'>
            <div className='w-full mx-auto  max-w-7xl'>
             <p className='text-center'>Selecione o tipo de serviço</p>
             <div className='mx-auto flex gap-4 mt-4 max-w-lg items-center px-4'>
              <Link href="/cardapio" className='px-8 border py-3 rounded-md border-red-600 text-red-600 font-bold'>voltar</Link>
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
