import React from 'react';
import Header from './components/Header';
import Link from 'next/link';
import Footer from './components/Footer';

const page = () => {
  return (
    
   <> 
    <Header />
    <div className='w-full bg-white min-h-screen flex items-center justify-center'>
      <div className="p-4 max-w-7xl mx-auto bg-white grid lg:grid-cols-2 items-start lg:pt-20 animaLeft">
    <div className='lg:mt-20 max-w-[600px]'>
      <h1 className='text-[40px] lg:text-[60px] font-bold text-gray-600 flex after:absolute after:w-10 after:h-3 after:bg-red-600 after:block'>HamburgueriaRx<span className='text-red-600'>.</span> </h1>
      <p className='text-gray-700'>HamburgueriaRx é a hamburgueria que traz a combinação perfeita de sabor, qualidade e inovação. Nosso cardápio é cuidadosamente elaborado para oferecer hambúrgueres artesanais suculentos, preparados com ingredientes frescos e selecionados. Seja para um almoço rápido, um jantar com amigos ou uma entrega no conforto de casa, a Rx Burguers garante uma experiência gastronômica única.!</p>
    <Link href="/cardapio" className='bg-red-600 py-3 px-8 rounded-md text-white mt-4 block max-w-[130px] text-center'>Cardápio</Link>
    </div>
    <div>
      <img src="/artesanal.avif" alt="imagem sanduiche"/>
    </div>
    </div>
    </div>
    <Footer />
   </>
  );
};

export default page;