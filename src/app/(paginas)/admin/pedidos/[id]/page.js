'use client'
import Image from 'next/image'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getToken } from '@/app/actions/getToken'
import Link from 'next/link'
import { baseURl } from '../../../../../../baseUrl'
import { useEffect, useState } from 'react'
import { loadGetInitialProps } from 'next/dist/shared/lib/utils'
import { useRouter } from 'next/navigation'



export default  function OrderPage({ params }) {
  const [order, setOrder] = useState([])
  const router = useRouter()
  const [total,setTotal] = useState(0)

  async function getOrder() {
    const token = await getToken()
  const res = await fetch(`${baseURl}/orders/${params.id}`, { 
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  const data = await res.json()

if(data.error==="Nenhum pedido encontrado"){
  router.push('/admin/pedidos')
}
setOrder(data)
const totalValue = data.products.map(prod=>prod.price * prod.quantity).reduce((acc, curr) => acc + curr, 0)
setTotal(totalValue)

}

useEffect(()=>{ 
  getOrder()
},[])

  const statusColors = {
    PENDENTE: 'bg-yellow-500',
    ACEITO: 'bg-blue-500',
    ENVIADO: 'bg-purple-500',
    ENTREGUE: 'bg-green-500',
    CANCELADO: 'bg-red-500',
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!order) {
    return <p>Carregando...</p>
  }




  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Pedido #{order._id}</span>
            <Badge className={`${statusColors[order.status]} text-white`}>
              {order.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Detalhes do Cliente</h2>
              <p><strong>Nome:</strong> {order.user?.name}</p>
              <p><strong>WhatsApp:</strong> {order.user?.whatsapp}</p>
              <p><strong>Endereço:</strong> {order.user?.rua}, {order.user?.numero}</p>
              <p><strong>Bairro:</strong> {order.user?.bairro}</p>
              {order.user?.complemento && <p><strong>Complemento:</strong> {order.user?.complemento}</p>}
              {order.user?.referencia && <p><strong>Referência:</strong> {order.user?.referencia}</p>}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Itens do Pedido</h2>
              <ul className="space-y-4">
                {order.products && order.products.map((product) => (
                  <li key={product._id} className="flex items-center space-x-4">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      width={80}
                      height={80}
                      className="rounded-md"
                    />
                    <div>
                      <p className="font-semibold">{product.title}</p>
                      <p>Quantidade: {product.quantity}</p>
                      <p>Preço: R$ {product.price.toFixed(2)}</p>
                      {product.observacao && <p className="text-sm text-gray-600">Obs: {product.observacao}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Total do Pedido</h2>
              <p className="text-2xl font-bold">R$ {total.toFixed(2)}</p>
            </div>
            <div className="text-sm text-gray-600">
              <p>Criado em: {formatDate(order.createdAt)}</p>
              <p>Atualizado em: {formatDate(order.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Link href="/admin/pedidos" className='mt-2 text-blue-500 block ml-1 font-bold'>voltar</Link>
    </div>
  )
}