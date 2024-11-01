// MeusPedidos.jsx

'use client'

import React, { useEffect, useState } from 'react'
import { MdArrowOutward, MdContentCopy } from "react-icons/md"
import { getToken } from '../actions/getToken'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'

const statusColors = {
  PENDENTE: 'bg-yellow-500',
  ACEITO: 'bg-green-500',
  ENVIADO: 'bg-blue-500',
  ENTREGUE: 'bg-gray-500',
  CANCELADO: 'bg-red-500',
}

const MeusPedidos= () => {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()


  useEffect(() => {
    getPedidos()
  }, [])

  console.log(pedidos)

  const getPedidos = async () => {
    const token = await getToken()
    setLoading(true)
  const response = await fetch('/api/infos', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })

  if(response.status===400){
    router.push('/auth/entrar')
  }

    try {
      const response = await fetch(`/api/pedidos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar os pedidos')
      }

      const data = await response.json()
      setPedidos(data.minhasOrders.reverse())
    } catch (error) {
      console.error(error)
      // Apenas exibe o toast em caso de erro
      toast.error("Erro ao carregar os pedidos. Tente novamente mais tarde.")
    }
    setLoading(false)
  }

  const calcularTotalPedido = (products) => {
    return products.reduce((total, product) => {
      return total + product.price * product.quantity
    }, 0)
  }

  const copiarIdPedido = (id) => {
    navigator.clipboard.writeText(id)
    toast.success("ID do pedido copiado para a área de transferência!")
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 ">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-primary mb-4">Meus Pedidos</h1>
      <p className="text-muted-foreground mb-4">Veja seu histórico de pedidos abaixo</p>

      <div className="space-y-6">
        {pedidos.map(pedido => (
          pedido.status !== "CANCELADO" && (
            <Card key={pedido._id} className="relative">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className='flex flex-col lg:flex-row'>
                    <span className="lg:text-lg font-semibold text-sm">Pedido ID:</span>
                    <span className="ml-2 font-medium text-sm">{pedido._id}</span>
                    <p className='text-sm'>Tipo serviço: {pedido.tipoServico}</p>
                    <p className='text-sm'>metodo de pagamento: {pedido.metodoPagamento}</p>
                    </div>
                   
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copiarIdPedido(pedido._id)}
                      className="flex items-center"
                      aria-label="Copiar ID do pedido"
                    >
                      <MdContentCopy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge className={`${statusColors[pedido.status]} absolute right-2 top-2 text-sm`}>{pedido.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pedido.products.map((product) => (
                    <div key={product._id} className="flex items-center">
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        width={64}
                        height={64}
                        className="rounded-md object-cover mr-4"
                      />
                      <div>
                        <p className="text-foreground">{product.quantity}x {product.title}</p>
                        <p className="text-muted-foreground text-sm">R$ {(product.price * product.quantity).toFixed(2)}</p>
                        {product.observacao && (
                          <p className="text-sm text-muted-foreground">Obs: {product.observacao}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <p className="text-lg font-bold text-foreground">
                  Total: R$ {calcularTotalPedido(pedido.products).toFixed(2)}
                </p>
                <Button asChild>
                  <Link href={`/pedidos/${pedido._id}`} className='bg-red-600 hover:bg-red-700'>
                    Ver pedido <MdArrowOutward className="ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )
        ))}
      </div>
    </div>
  )
}

export default MeusPedidos
