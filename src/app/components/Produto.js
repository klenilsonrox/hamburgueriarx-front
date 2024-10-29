'use client';
import React, { useEffect, useState } from 'react';
import { baseURl } from '../../../baseUrl';
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useCart } from '../contexts/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Importação dos estilos

const SkeletonLoader = () => (
  <div className="max-w-7xl mx-auto p-8 animate-pulse">
    <div className="h-10 w-24 bg-gray-300 rounded-lg mb-6"></div>
    <div className="flex flex-col sm:flex-row bg-white shadow-xl rounded-3xl overflow-hidden">
      <div className="w-full sm:w-1/2 h-80 bg-gray-300 rounded-t-3xl sm:rounded-l-3xl"></div>
      <div className="w-full sm:w-1/2 p-8 space-y-4">
        <div className="h-8 w-3/4 bg-gray-300 rounded-lg mb-4"></div>
        <div className="h-4 w-full bg-gray-300 rounded-lg mb-2"></div>
        <div className="h-4 w-5/6 bg-gray-300 rounded-lg mb-2"></div>
        <div className="h-6 w-32 bg-red-300 rounded-lg mt-6"></div>
      </div>
    </div>
  </div>
);

const Produto = ({ slug }) => {
  const { addToCart, aumentarQtd, diminuirQtd, observacao, setObservacao } = useCart();
  const [produto, setProduto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qtd, setQtd] = useState(1);

  function aumentarQuantidade() {
    setQtd(qtd + 1);
  }

  function diminuirQuantidade() {
    if (qtd > 1) {
      setQtd(qtd - 1);
    }
  }

  const getProduto = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseURl}/products/slug/${slug}`);
      const { product } = await response.json();
      setProduto(product);
    } catch (error) {
      console.error("Erro ao carregar o produto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProduto();
  }, [slug]);

  const handleAddToCart = () => {
    addToCart(produto, qtd);
    toast.success("Produto adicionado ao carrinho!");  // Notificação de sucesso
    setQtd(1);
    setTimeout(() => {
      window.location.href = "/cardapio";
    }, 500);
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!produto) {
    return <div className="text-center text-lg text-gray-700 mt-10">Produto não encontrado.</div>;
  }

  return (
    <>
    {produto.status === "AVAILABLE" && 
    <div className="max-w-7xl mx-auto p-6 md:p-8">
    <button
      className="text-red-600 border hover:text-white border-red-600 hover:bg-red-600 px-6 py-2 rounded-full mb-8 mt-2 flex items-center"
      onClick={() => window.history.back()}
    >
      <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10.293 4.293a1 1 0 011.414 1.414L6.414 10l5.293 5.293a1 1 0 11-1.414 1.414l-6-6a1 1 0 010-1.414l6-6z" clipRule="evenodd" />
      </svg>
      Voltar
    </button>

    <div className="flex flex-col sm:flex-row bg-white shadow-lg rounded-3xl overflow-hidden">
      <div className="sm:w-1/2 flex justify-center items-center p-6">
        <img
          src={produto.imageUrl}
          alt={produto.title}
          className="w-full h-[400px] object-cover rounded-2xl shadow-lg border transition-transform duration-300 transform hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">{produto.title}</h1>
          <p className="text-xl font-semibold text-red-600 mt-2">R$ {Number(produto.price).toFixed(2)}</p>
          <p className="text-gray-600 leading-6 mt-4">{produto.description}</p>
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
            <span>{qtd}</span>
            <FaPlus className="cursor-pointer" onClick={aumentarQuantidade} />
          </div>

          <button
            className="w-full py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
            onClick={handleAddToCart}
          >
            Adicionar R$ {Number(Number(produto.price).toFixed(2) * qtd).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
  </div>
      }
    </>
  );
};

export default Produto;
