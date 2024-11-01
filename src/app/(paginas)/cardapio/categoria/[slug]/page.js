'use client'
import React, { useEffect, useState } from 'react';
import { baseURl } from '../../../../../../baseUrl';
import { MdRestaurant, MdAdd, MdRemove,MdOutlineShoppingCart } from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose 
  } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";
import { useCart } from '@/app/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';


const page = ({ params }) => {
    const { slug } = params; 
    const [categoria, setCategoria] = useState(null);
    const { cart, addToCart, observacao, setObservacao } = useCart();
    const [isLoading, setIsLoading] = useState(true);
    const [aleatorio, setAleatorio] = useState(null);
    const [page, setPage] = useState(1); // Página atual
    const [limit] = useState(10); // Produtos por página
    const [totalPages, setTotalPages] = useState(1); // Número total de páginas
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productQuantity, setProductQuantity] = useState(1);

    const handleQuantityChange = (change) => {
        setProductQuantity(prev => {
            const newQuantity = prev + change;
            return newQuantity > 0 ? newQuantity : 1;
        });
    };


    const handleAddToCart = () => {
        if (!selectedProduct) return;
        // Create a cart item with quantity and observation
        const cartItem = {
            ...selectedProduct,
            observacao,
            quantity: productQuantity
        };

        addToCart(cartItem,productQuantity);
        
        // Reset modal state
        setSelectedProduct(null);
        setProductQuantity(1);
 
    };


    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        // Reset quantity and observation when opening modal
        setProductQuantity(1);
 
    };
    const getCategoria = async () => {
      
        try {
            setIsLoading(true);
            const response = await fetch(`${baseURl}/categories/slug/${slug}`);
            const data = await response.json();
    
            setCategoria(data.category);
        } catch (error) {
            console.error("Erro ao carregar a categoria:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCategoria();
        getAleatorio();
    }, []); // Atualiza sempre que a página mudar

    if (!categoria) {
        return <div className='w-full max-w-7xl mx-auto p-4'>
            <p>carregando...</p>
        </div>
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
                        <div 
                                key={produto.id} 
                                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="relative h-48 w-full">
                                    {produto.imageUrl ? (
                                        <Image
                                            src={produto.imageUrl}
                                            alt={produto.title}
                                            layout="fill"
                                            objectFit="cover"
                                            className="hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="bg-gray-200 h-full flex items-center justify-center">
                                            <MdRestaurant size={50} className="text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h2 className="text-lg font-bold text-gray-800 truncate">{produto.title}</h2>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-2 truncate">{produto.description}</p>
                                    <div className="flex flex-col space-y-2">
                                        <span className="text-red-600 font-bold text-lg">R$ {Number(produto.price).toFixed(2)}</span>
                                        <div className="flex space-x-2">
                                            <Button 
                                                onClick={() => handleViewProduct(produto)}
                                                className="flex-1 bg-red-100 text-red-600 hover:bg-red-200"
                                            >
                                                Ver Produto
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
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

{/* Product Details Modal */}
<Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
                <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                    {selectedProduct && (
                        <>
                            <div className="relative h-64 w-full mb-4">
                                {selectedProduct.imageUrl ? (
                                    <Image
                                        src={selectedProduct.imageUrl}
                                        alt={selectedProduct.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-t-lg"
                                    />
                                ) : (
                                    <div className="bg-gray-200 h-full flex items-center justify-center">
                                        <MdRestaurant size={50} className="text-gray-500" />
                                    </div>
                                )}
                            </div>
                            
                            <DialogHeader>
                                <DialogTitle className="text-2xl text-gray-800">{selectedProduct.title}</DialogTitle>
                                <DialogDescription className="text-gray-600">
                                    {selectedProduct.description}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-red-600">
                                        R$ {Number(selectedProduct.price).toFixed(2)}
                                    </span>
                                    <span className="text-green-600 font-semibold">
                                        {selectedProduct.status === "AVAILABLE" ? "Disponível" : "Indisponível"}
                                    </span>
                                </div>

                                {selectedProduct.additionalDetails && (
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2">Detalhes Adicionais:</h3>
                                        <p className="text-gray-600">{selectedProduct.additionalDetails}</p>
                                    </div>
                                )}

                                {/* Quantity Selector */}
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-gray-700 font-medium">Quantidade:</span>
                                    <div className="flex items-center space-x-2">
                                        <Button 
                                            onClick={() => handleQuantityChange(-1)}
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 border-red-600 text-red-600 hover:bg-red-50"
                                        >
                                            <MdRemove />
                                        </Button>
                                        <span className="text-lg font-bold min-w-[40px] text-center">{productQuantity}</span>
                                        <Button 
                                            onClick={() => handleQuantityChange(1)}
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 border-red-600 text-red-600 hover:bg-red-50"
                                        >
                                            <MdAdd />
                                        </Button>
                                    </div>
                                </div>

                                {/* Observation Field */}
                                <div className="mt-4">
                                    <label 
                                        htmlFor="product-observation" 
                                        className="block text-gray-700 font-medium mb-2"
                                    >
                                        Observações
                                    </label>
                                    <Textarea 
                                        id="product-observation"
                                        placeholder={`${selectedProduct.categoryId==="b49f8ff7-7e5a-4842-bd71-0cc20c3ac9d8" ? "ex: Cola cola zero":"ex: x tudo sem milho"} `}
                                        value={observacao}
                                        onChange={(e) => setObservacao(e.target.value)}
                                        className="w-full border-red-300 focus:border-red-500 focus:ring-red-500"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-2 p-4">
                                <Button 
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                    disabled={selectedProduct.status !== "AVAILABLE"}
                                >
                                    Adicionar ao Carrinho
                                </Button>
                                <DialogClose asChild>
                                    <Button 
                                        variant="outline"
                                        className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                                    >
                                        Fechar
                                    </Button>
                                </DialogClose>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {cart && cart.length > 0 && (
                <Link 
                    href="/carrinho" 
                    className="fixed bottom-6 right-6 bg-red-600 text-white rounded-full p-4 shadow-2xl hover:bg-red-700 transition duration-300 z-50 flex items-center"
                >
                    <MdOutlineShoppingCart size={24} />
                    <span className="ml-2 bg-white text-red-600 rounded-full px-2 text-sm font-bold">
                        {cart.length}
                    </span>
                </Link>
            )}

        </div>
    );
};

export default page;
