'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        fetch('/api/categorias')
            .then(response => response.json())
            .then(data => setCategorias(data.categories)); // Acessando a propriedade "categories"
    }, []);

    return (
        <div className="py-4">
            <div className="flex lg:grid lg:grid-cols-10 gap-4 overflow-x-scroll lg:overflow-x-hidden">
                {categorias && categorias.map((categoria) => (
                    <Link key={categoria.id} href={`/cardapio/categoria/${categoria.slug}`} passHref>
                        <div className="relative rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col items-center w-[120px] group">
                            <img 
                                src={categoria.imageUrl} 
                                alt={categoria.name} 
                                className="h-[90px] w-[90px] object-cover rounded-md transform transition-transform duration-300 group-hover:scale-110"
                            />
                            <h2 className="text-sm font-semibold mt-2 text-center text-gray-800 transition-colors duration-300 group-hover:text-red-600">{categoria.name}</h2>
                            <div className="absolute inset-0 bg-red-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10 rounded-lg"></div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Categorias;
