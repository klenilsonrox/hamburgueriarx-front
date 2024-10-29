'use client';
import React, { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Checkout = () => {
    const { cart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setProducts(cart);
        if (cart.length === 0) {
            router.push("/cardapio");
        }
    }, [cart]);

    async function fecharPedido() {
        try {
            setLoading(true);
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(products),
            });

            const data = await response.json();

            if (response.status === 201) {
                toast.success("Pedido realizado com sucesso");
                console.log(data._id);

                const numero = "+5531992311170"; // Número do cliente
                const link = `https://hamburgueriarx.vercel.app/conta/pedidos/${data._id}`; // Link do pedido
                const mensagem = `Olá, boa noite, acabei de fazer esse pedido: ${link}`;
                const whatsappUrl = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

                // Redirecionar para WhatsApp
                window.open(whatsappUrl, '_blank');

                localStorage.setItem("cart", JSON.stringify([]));
                setTimeout(() => {
                    router.push(`/conta/pedidos/${data._id}`);
                }, 3000); // Ajustar o tempo conforme necessário
            } else {
                toast.error("Erro ao realizar o pedido");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    if (products.length === 0) {
        return <p>Seu carrinho está vazio</p>;
    }

    const totalPrice = cart.reduce((total, item) => total + item.quantity * item.price, 0);

    return (
        <div>
            <ToastContainer />
            <div className='flex items-center justify-between py-2'>
                <h1 className='py-2'>Resumo do Pedido</h1>
                <Link href="/delivery" className='text-red-600'>Voltar</Link>
            </div>
            <div>
                <div className='bg-gray-100 p-2 flex flex-col gap-2 border-b border'>
                    {products && products.map(({ title, price, imageUrl, observacao, id, quantity }) => (
                        <div key={id} className='border-b py-2'>
                            <div className='flex gap-2'>
                                <img src={imageUrl} alt={`imagem do ${title}`} className='w-[80px] h-[80px] object-cover rounded-md' />
                                <div>
                                    <p>({quantity}x) - {title} - R$ {Number(quantity * price).toFixed(2)}</p>
                                    <p>{observacao}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex items-center justify-between bg-gray-100 mt-2 p-2 border flex-col lg:flex-row'>
                <div>
                    <p>Subtotal: R$ {Number(totalPrice).toFixed(2)}</p>
                    <p>Taxa de entrega: R$ 3,00</p>
                    <p>Total: R$ {Number(totalPrice + 3).toFixed(2)}</p>
                </div>
                <div className='flex flex-col gap-2 mt-4 lg:mt-0'>
                    <button className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded cursor-pointer' onClick={fecharPedido} disabled={loading}>
                        {loading ? 'Finalizando...' : 'Finalizar Pedido'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
