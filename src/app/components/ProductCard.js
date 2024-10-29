import Link from 'next/link';
import React from 'react';

const ProductCard = ({produto}) => {
  return (
    <>
    {produto.status==='AVAILABLE' && (
        <Link key={produto.id} href={`/cardapio/produtos/${produto.slug}`} className='rounded-lg border border-gray-300 bg-white hover:shadow-lg transition-shadow transform hover:scale-105 duration-200'>
        <div className="overflow-hidden rounded-lg">
            <img
                src={produto.imageUrl}
                alt={produto.title}
                className="w-full h-40 object-cover rounded-t-lg transition-transform duration-300 transform hover:scale-110"
            />
        </div>
        <div className='p-4'>
            <h2 className="font-bold text-lg mb-2 truncate">{produto.title}</h2>
            <p className="text-sm text-gray-600 mb-2 truncate">{produto.description}</p>
            <p className="text-lg font-semibold text-red-600">R$ {produto.price.toFixed(2)}</p>
        </div>
    </Link>
    )}
    </>
  );
};

export default ProductCard;