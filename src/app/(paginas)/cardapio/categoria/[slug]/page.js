'use client'
import React, { useEffect, useState } from 'react';
import { baseURl } from '../../../../../../baseUrl';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';

const page = ({ params }) => {
    const { slug } = params;
    const [categoria, setCategoria] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [aleatorio, setAleatorio] = useState(null);
    const [page, setPage] = useState(1); // Página atual
    const [limit] = useState(10); // Produtos por página
    const [totalPages, setTotalPages] = useState(1); // Número total de páginas

    const getCategoria = async (page) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${baseURl}/categories/slug/${slug}?page=${page}&limit=${limit}`);
            const { category, totalPages } = await response.json();
            setCategoria(category);
            setTotalPages(totalPages); // Atualizando o número total de páginas
        } catch (error) {
            console.error("Erro ao carregar a categoria:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCategoria(page);
        getAleatorio();
    }, [page]); // Atualiza sempre que a página mudar

    if (!categoria) {
        return <div className="text-center">Carregando...</div>;
    }

    const classe = ["animaLeft", "animaRight"];

    function getAleatorio() {
        const alea = Math.floor(Math.random() * 2);
        setAleatorio(alea);
        return alea;
    }

    return (
        <div className={`w-full max-w-7xl mx-auto p-4 ${classe[aleatorio]}`}>
            <h1 className="text-3xl font-bold text-center mb-6 text-red-600">{slug.charAt(0).toUpperCase() + slug.slice(1)}</h1>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {isLoading ? (
                    // Skeleton Loader para produtos
                    Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="block p-4 border rounded-lg shadow-lg bg-white animate-pulse">
                            <div className="w-full h-40 bg-gray-300 rounded-t-lg"></div>
                            <div className="p-4">
                                <div className="w-3/4 h-6 bg-gray-300 rounded mb-2"></div>
                                <div className="w-5/6 h-4 bg-gray-300 rounded mb-4"></div>
                                <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    // Exibindo os produtos reais
                    categoria.products.map((produto) => (
                        <ProductCard key={produto.id} produto={produto} />
                    ))
                )}
            </div>

            {/* Paginação */}
            <div className="flex justify-between items-center mt-8">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300 ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Anterior
                </button>

                <span className="text-lg font-semibold">
                    Página {page} de {totalPages}
                </span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300 ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Próxima
                </button>
            </div>

            {categoria.products.length < 1 && !isLoading && (
                <p className="text-center text-gray-600 mt-6">Não há produtos nesta categoria.</p>
            )}
        </div>
    );
};

export default page;
