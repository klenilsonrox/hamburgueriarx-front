'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import { MdOutlineShoppingCart, MdRestaurant, MdAdd, MdRemove } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";

const ProdutosIFoodStyle = () => {
    const [produtos, setProdutos] = useState([]);
    const { cart, addToCart, observacao, setObservacao } = useCart();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productQuantity, setProductQuantity] = useState(1);
    const limit = 10;

    useEffect(() => {
        const getProdutos = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/produtos?page=${currentPage}&limit=${limit}`);
                const data = await response.json();

                // Sort products by popularity or keep current sorting
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

    const handleQuantityChange = (change) => {
        setProductQuantity(prev => {
            const newQuantity = prev + change;
            return newQuantity > 0 ? newQuantity : 1;
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            

            <div className="container ">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {loading
                        ? Array.from({ length: 10 }).map((_, index) => (
                            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden animate-pulse">
                                <Skeleton className="h-48 w-full bg-gray-300" />
                                <div className="p-4">
                                    <Skeleton className="h-4 w-3/4 mb-2 bg-gray-300" />
                                    <Skeleton className="h-4 w-1/2 bg-gray-300" />
                                </div>
                            </div>
                        ))
                        : produtos.filter(product => product.status === "AVAILABLE").map((product) => (
                            <div 
                                key={product.id} 
                                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="relative h-48 w-full">
                                    {product.imageUrl ? (
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
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
                                    <h2 className="text-lg font-bold text-gray-800 truncate">{product.title}</h2>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-2 truncate">{product.description}</p>
                                    <div className="flex flex-col space-y-2">
                                        <span className="text-red-600 font-bold text-lg">R$ {Number(product.price).toFixed(2)}</span>
                                        <div className="flex space-x-2">
                                            <Button 
                                                onClick={() => handleViewProduct(product)}
                                                className="flex-1 bg-red-100 text-red-600 hover:bg-red-200"
                                            >
                                                Ver Produto
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center mt-6 space-x-4">
                    <Button 
                        onClick={() => setCurrentPage(prevPage => Math.max(1, prevPage - 1))}
                        disabled={currentPage === 1}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Anterior
                    </Button>
                    <span className="text-gray-700">
                        Página {currentPage} de {totalPages}
                    </span>
                    <Button 
                        onClick={() => setCurrentPage(prevPage => Math.min(totalPages, prevPage + 1))}
                        disabled={currentPage === totalPages}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Próxima
                    </Button>
                </div>
            </div>

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
                                        placeholder="Ex: Sem cebola, extra molho..."
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

            {/* Cart Floating Button */}
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

export default ProdutosIFoodStyle;