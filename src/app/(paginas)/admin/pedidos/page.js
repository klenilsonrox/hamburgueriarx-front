'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { CheckCircle, Clock, Package, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu'
import { getToken } from '@/app/actions/getToken'
import Link from 'next/link'
import { baseURl } from '../../../../../baseUrl'

const statusIcons = {
  PENDENTE: <Clock className="h-5 w-5 text-yellow-500" />,
  ACEITO: <CheckCircle className="h-5 w-5 text-blue-500" />,
  ENVIADO: <Package className="h-5 w-5 text-purple-500" />,
  ENTREGUE: <CheckCircle className="h-5 w-5 text-green-500" />,
  CANCELADO: <X className="h-5 w-5 text-red-500" />,
}

export default function OrderManagement() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
        const token =await getToken() 
      const response = await fetch(`${baseURl}/orders` ,{
        headers: {
          'Authorization': `Bearer ${token}`
        },  
        
      })
      const data = await response.json()
      setOrders(data.orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const token = await getToken()
      const response = await fetch(`${baseURl}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        fetchOrders() // Refresh orders after updating
      } else {
        console.error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card key={order._id} className="w-full relative">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Order #{order._id.slice(-4)}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-2">
                      {statusIcons[order.status]} {order.status}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'ACEITO')}>
                      <CheckCircle className="mr-2 h-4 w-4" /> ACEITO
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'ENVIADO')}>
                      <Package className="mr-2 h-4 w-4" /> ENVIADO
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'ENTREGUE')}>
                      <CheckCircle className="mr-2 h-4 w-4" /> ENTREGUE
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'CANCELADO')}>
                      <X className="mr-2 h-4 w-4" /> CANCELADO
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="font-semibold">Detalhes do pedido:</h3>
                <p>{order.user.name}</p>
                <p>{order.user.whatsapp}</p>
                <p>{`${order.user.rua}, ${order.user.numero}`}</p>
                <p>{order.user.bairro}</p>
                {order.user.complemento && <p>Complemento: {order.user.complemento}</p>}
                {order.user.referencia && <p>Referência: {order.user.referencia}</p>}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Order Items:</h3>
                {order.products.map((product) => (
                  <div key={product.id} className="flex items-center mb-2">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      width={50}
                      height={50}
                      className="rounded-md mr-2"
                    />
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {product.quantity} - R$ {product.price.toFixed(2)}
                      </p>
                      {product.observacao && (
                        <p className="text-sm text-gray-500">Note: {product.observacao}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="font-semibold">
                  Total: R$ {order.products.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Feito em: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
            <Link href={`/admin/pedidos/${order._id}`} className='ml-6 absolute bottom-2 right-2 font-bold text-red-600'>Ver pedido</Link>
          </Card>
        ))}
        
      </div>
    </div>
  )
}
