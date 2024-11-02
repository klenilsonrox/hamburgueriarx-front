'use client'
import React, { useEffect, useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { useCart } from '@/app/contexts/CartContext';
import { IoMdClose } from "react-icons/io";

import { baseURl } from '../../../../../../../baseUrl';
import { MdAdd, MdRemove } from "react-icons/md";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
  
const ProductPage = ({ params }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productQuantity, setProductQuantity] = useState(1);
    const { cart, addToCart, observacao, setObservacao } = useCart();
    const router = useRouter();

    const getProduct = async () => {
        const response = await fetch(`${baseURl}/products/${params.id}`);
        const data = await response.json();
        setSelectedProduct(data.product);
    };

    useEffect(() => {
        getProduct();
    }, []);

    const handleAddToCart = () => {
        if (!selectedProduct) return;
        const cartItem = {
            ...selectedProduct,
            observacao,
            quantity: productQuantity
        };
      
        addToCart(cartItem, productQuantity);
        setObservacao("")
        toast.success(`${productQuantity} ${selectedProduct.title} ${productQuantity > 1 ? 'adicionados' : 'adicionado'} ao carrinho`);
        setProductQuantity(1);
        setTimeout(()=>{
            router.push("/cardapio")
        },1000)
    };

    const handleIncreaseQuantity = () => {
        setProductQuantity(prev => prev + 1);
    };

    const handleDecreaseQuantity = () => {
        setProductQuantity(prev => prev > 1 ? prev - 1 : 1);
    };

    function backCardapio(e) {
        if (e.target.id === "modal") {
            router.push("/cardapio");
        }
    }

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4" 
            onClick={backCardapio} 
            id="modal"
        >
           
            <ToastContainer />
            <Card className="w-full max-w-md bg-white rounded-lg overflow-hidden relative">
            <button className='absolute right-2 top-2'><IoMdClose size={24} className='text-red-600' onClick={() => router.push("/cardapio")}/></button>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        {selectedProduct?.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative h-64 w-full">
                        <img 
                            src={selectedProduct?.imageUrl} 
                            alt={selectedProduct?.title}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>


                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600">
                            R$ {selectedProduct?.price.toFixed(2)}
                        </span>
                        <div className="flex items-center space-x-2">
                            <Button 
                                variant="outline" 
                                size="icon"
                                onClick={handleDecreaseQuantity}
                                className="h-8 w-8"
                            >
                                <MdRemove className="h-4 w-4" />
                            </Button>
                            <span className="text-lg font-medium w-8 text-center">
                                {productQuantity}
                            </span>
                            <Button 
                                variant="outline" 
                                size="icon"
                                onClick={handleIncreaseQuantity}
                                className="h-8 w-8"
                            >
                                <MdAdd className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <CardDescription>
                        {selectedProduct?.description}
                    </CardDescription>

                    <Textarea
                        placeholder="Observações sobre seu pedido..."
                        className="min-h-[100px]"
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                    />

                    <Button 
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleAddToCart}
                    >
                        Adicionar ao Carrinho
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductPage;