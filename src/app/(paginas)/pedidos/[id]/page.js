'use client';
import React, { useEffect, useState } from 'react';
import { MdArrowOutward } from 'react-icons/md';
import { getToken } from '@/app/actions/getToken';
import { baseURl } from '../../../../../baseUrl';
import Header from '@/app/components/Header';


const PedidoDetalhe = ({ params }) => {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status,setStatus] = useState(null);
  // Função para buscar o pedido por ID



  async function fetchPedido() {
    const token = await getToken();
    try {
      const response = await fetch(`${baseURl}/orders/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });


      const data = await response.json();
      console.log(data)
      if (response.status === 200) {
        setPedido(data.order);
      }
    } catch (error) {
      console.error('Erro ao buscar o pedido:', error);
    }
    setLoading(false);
  }

  // UseEffect para inicializar o pedido e configurar o socket
  useEffect(() => {
    // Busque o pedido inicial
    fetchPedido();

  }, []); // Apenas 'params.id' como dependência para inicialização



  if (loading) {
    return  <>
    <Header />
    <div className='w-full max-w-7xl mx-auto p-4 bg-white rounded-md mt-4'>
      <h1 className='w-[250px] h-[30px] bg-gray-200 rounded-md animate-pulse duration-700'></h1>
      <h1 className='w-[230px] h-[30px] bg-gray-200 mt-6  rounded-md animate-pulse duration-700'></h1>
      <h1 className='w-[238px] h-[30px] bg-gray-200 mt-3  rounded-md animate-pulse duration-700'></h1>
      <h1 className='w-[238px] h-[30px] bg-gray-200 mt-3  rounded-md animate-pulse duration-700'></h1>
      <h1 className='w-[238px] h-[30px] bg-gray-200 mt-3  rounded-md animate-pulse duration-700'></h1>
      <h1 className='w-[155px] h-[30px] bg-gray-200 mt-8  rounded-md animate-pulse duration-700'></h1>
      <h1 className='w-[125px] h-[30px] bg-gray-200 mt-3  rounded-md animate-pulse duration-700'></h1>
      <h1 className='w-[125px] h-[30px] bg-gray-200 mt-8  rounded-md animate-pulse duration-700'></h1>
      <div className='flex ga-2 items-center'>
        <div className='w-[90px] h-[90px] bg-gray-200 mt-8  rounded-md animate-pulse duration-700'></div>
        <div className='ml-2'>
        <h1 className='w-[125px] h-[30px] bg-gray-200 mt-3  rounded-md animate-pulse duration-700'></h1>
        <h1 className='w-[125px] h-[30px] bg-gray-200 mt-3  rounded-md animate-pulse duration-700'></h1>
        </div>
      </div>
    </div>
    </>
  }

  if (!pedido) {
    return <div className='w-full max-w-7xl mx-auto p-4'>
      <p>Pedido não encontrado.</p>
    </div>
  }



  // Calcular o total do pedido
  const calcularTotalPedido = () => {
    return pedido.products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };




  return (
    <>
    <Header />

    

    <div className="p-4 max-w-7xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Detalhes do Pedido</h2>

        {/* Informações do Usuário */}

        
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Informações do Cliente</h3>
          <p className="text-gray-700"><strong>Nome:</strong> {pedido.user?.name}</p>
          <p className="text-gray-700"><strong>WhatsApp:</strong> {pedido.user?.whatsapp}</p>
          <p className="text-gray-700"><strong>Endereço:</strong> {pedido.user?.rua}, {pedido.user?.numero}, {pedido.user?.bairro}</p>
          {pedido.user?.complemento && <p className="text-gray-700"><strong>Complemento:</strong> {pedido.user?.complemento}</p>}
          {pedido.user?.referencia && <p className="text-gray-700"><strong>Referência:</strong> {pedido.user?.referencia}</p>}
        </div>

        {/* Status do Pedido */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Status do Pedido: <span className={`font-medium ${pedido.status === 'PENDENTE' ? 'text-orange-500' : 'text-green-500'}`}>{pedido.status}</span></h3>
          
          <p><strong>Tipo de serviço</strong> :{pedido.tipoServico}</p>
          <p><strong>Método de pagamento</strong> :{pedido.metodoPagamento}</p>
        </div>

        {/* Lista de Produtos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Produtos</h3>
          <div className="divide-y divide-gray-200">
            {pedido.products.map((product) => (
              <div key={product.id} className="py-4 flex items-center">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-16 h-16 object-cover mr-4 rounded-lg border"
                />
                <div className="flex-1">
                  <p className="text-gray-700 font-semibold">{product.title}</p>
                  <p className="text-gray-500">{product.quantity}x - R$ {product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total do Pedido */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold">Total</h3>
          <p className="text-xl font-bold">R$ {calcularTotalPedido().toFixed(2)}</p>
        </div>
      </div>

      {/* Botão para Voltar */}
      <div className="mt-6">
        <a href="/pedidos" className="text-red-600 font-bold flex items-center gap-2">
          Voltar para Meus Pedidos <MdArrowOutward />
        </a>
      </div>
    </div>
    </>
  );
};

export default PedidoDetalhe;
