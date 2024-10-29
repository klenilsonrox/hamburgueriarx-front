'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import { MdOutlineShoppingCart } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Produtos = () => {
    const [produtos, setProdutos] = useState([]);
    const { cart } = useCart();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        const getProdutos = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/produtos?page=${currentPage}&limit=${limit}`);
                const data = await response.json();

                // Ordena os produtos do mais caro para o mais barato
                const sortedProducts = data.products.sort((a, b) => Number(b.price) - Number(a.price));
                
                setProdutos(sortedProducts);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Erro ao carregar os produtos:', error);
            } finally {
                setLoading(false);
            }
        };
        getProdutos();
    }, [currentPage]);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className='container mx-auto px-4'>
            <h1 className="text-3xl font-bold text-center mb-6">Todos os Produtos</h1>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {loading
                    ? Array.from({ length: 10 }).map((_, index) => (
                        <Card key={index} className="flex flex-col justify-between">
                            <CardHeader>
                                <Skeleton className="h-40 w-full" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-5/6 mb-4" />
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-8 w-full" />
                            </CardFooter>
                        </Card>
                    ))
                    : produtos && produtos.map((product) => (
                        product.status === "AVAILABLE" &&
                        <Card key={product.id} className="flex flex-col justify-between">
                            <CardHeader className="relative h-40 w-full">
                                {product.imageUrl ? (
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-t-lg"
                                    />
                                ) : (
                                    <Skeleton className="h-40 w-full" />
                                )}
                            </CardHeader>
                            <CardContent>
                                <CardTitle className="text-xl font-semibold mb-2">{product.title}</CardTitle>
                                <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                                <p className="text-lg font-bold mt-2">R$ {Number(product.price).toFixed(2)}</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full"><Link href={`/cardapio/produtos/${product.slug}`}>Detalhes</Link></Button>
                            </CardFooter>
                        </Card>
                    ))}
            </div>

            {/* Controles de paginação */}
            <div className="flex justify-between items-center mt-6">
                <Button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    variant={currentPage === 1 ? "secondary" : "default"}
                    className="bg-red-600 hover:bg-red-700"
                >
                    Anterior
                </Button>
                
                <span className="font-semibold">Página {currentPage} de {totalPages}</span>

                <Button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    variant={currentPage === totalPages ? "secondary" : "default"}
                    className="bg-red-600 hover:bg-red-700"
                >
                    Próxima
                </Button>
            </div>

            {cart && cart.length > 0 && (
                <div className='fixed bottom-5 right-5'>
                    <Link href={'/carrinho'} className='flex items-center justify-center py-2 px-4 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition duration-200 relative'>
                        <MdOutlineShoppingCart size={25} /> 
                        <span className='absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-white text-red-600 rounded-full px-2 text-xs font-bold'>{cart.length}</span>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Produtos;
