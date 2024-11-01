'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import { MdOutlineShoppingCart, MdRestaurant, MdClose } from "react-icons/md";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
        if (selectedProduct) {
            addToCart(selectedProduct, productQuantity);
            toast.success("Produto adicionado ao carrinho!");
            setProductQuantity(1);
            setSelectedProduct(null);
        }
    };

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setProductQuantity(1);
        setObservacao('');
    };

    const aumentarQuantidade = () => {
        setProductQuantity(prevQty => prevQty + 1);
    };

    const diminuirQuantidade = () => {
        setProductQuantity(prevQty => Math.max(1, prevQty - 1));
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Previous code remains the same... */}

            {/* Product Details Modal */}
            <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    {selectedProduct && selectedProduct.status === "AVAILABLE" && (
                        <div className="flex flex-col sm:flex-row bg-white rounded-3xl overflow-hidden">
                            <div className="sm:w-1/2 flex justify-center items-center p-6">
                                <img
                                    src={selectedProduct.imageUrl}
                                    alt={selectedProduct.title}
                                    className="w-full h-[400px] object-cover rounded-2xl shadow-lg border transition-transform duration-300 transform hover:scale-105"
                                />
                            </div>

                            <div className="flex flex-1 flex-col justify-between p-6">
                                <div>
                                    <h1 className="text-3xl font-semibold text-gray-800">{selectedProduct.title}</h1>
                                    <p className="text-xl font-semibold text-red-600 mt-2">
                                        R$ {Number(selectedProduct.price).toFixed(2)}
                                    </p>
                                    <p className="text-gray-600 leading-6 mt-4">{selectedProduct.description}</p>
                                </div>

                                <div className="mt-6">
                                    <label htmlFor="observacao" className="text-sm font-medium">Observação</label>
                                    <textarea
                                        cols="30"
                                        rows="3"
                                        className="w-full bg-gray-100 border rounded-md p-2 outline-none mt-2"
                                        onChange={(e) => setObservacao(e.target.value)}
                                        value={observacao}
                                        placeholder="exemplo: x tudo sem cebola"
                                    ></textarea>
                                </div>

                                <div className="flex items-center justify-between mt-4 gap-2">
                                    <div className="flex items-center gap-2 border py-3 px-6 rounded-lg">
                                        <FaMinus className="cursor-pointer" onClick={diminuirQuantidade} />
                                        <span>{productQuantity}</span>
                                        <FaPlus className="cursor-pointer" onClick={aumentarQuantidade} />
                                    </div>

                                    <button
                                        className="w-full py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
                                        onClick={handleAddToCart}
                                    >
                                        Adicionar R$ {Number(Number(selectedProduct.price).toFixed(2) * productQuantity).toFixed(2)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

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