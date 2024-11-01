'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ArrowLeft, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Checkout() {
  const { cart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    setProducts(cart)
    if (cart.length === 0) {
      router.push("/cardapio")
    }
  }, [cart, router])

  const totalPrice = cart.reduce((total, item) => total + item.quantity * item.price, 0)
  const deliveryFee = 3
  const finalTotal = totalPrice + deliveryFee

  async function fecharPedido() {
    try {
      setLoading(true)
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(products),
      })

      const data = await response.json()

      if (response.status === 201) {
        setOrderId(data._id)
        setShowModal(true)
        localStorage.setItem("cart", JSON.stringify([]))
      } else {
        toast.error("Erro ao realizar o pedido")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao processar o pedido")
    } finally {
      setLoading(false)
    }
  }

  function sendWhatsApp() {
    const numero = "+5531992311170"
    const link = `https://hamburgueriarx.vercel.app/pedidos/${orderId}`
    const mensagem = `Olá, boa noite, acabei de fazer esse pedido: ${link}`
    const whatsappUrl = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
    window.open(whatsappUrl, '_blank')
    router.push(`/pedidos/${orderId}`)
  }

  if (products.length === 0) {
    return <p>Seu carrinho está vazio</p>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Resumo do Pedido</span>
            <Link href="/delivery" className="text-red-600 hover:text-red-800 transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map(({ title, price, imageUrl, observacao, id, quantity }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <Image src={imageUrl} alt={`imagem do ${title}`} width={80} height={80} className="rounded-md object-cover" />
                <div className="flex-grow">
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-gray-600">Quantidade: {quantity}</p>
                  <p className="text-sm text-gray-600">Preço: R$ {Number(quantity * price).toFixed(2)}</p>
                  {observacao && <p className="text-sm text-gray-500">Obs: {observacao}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-4 rounded-b-lg">
          <div className="text-sm space-y-1 mb-4 sm:mb-0">
            <p>Subtotal: <span className="font-semibold">R$ {Number(totalPrice).toFixed(2)}</span></p>
            <p>Taxa de entrega: <span className="font-semibold">R$ {deliveryFee.toFixed(2)}</span></p>
            <p className="text-lg font-bold">Total: R$ {Number(finalTotal).toFixed(2)}</p>
          </div>
          <Button
            onClick={fecharPedido}
            disabled={loading}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"
          >
            {loading ? 'Finalizando...' : 'Finalizar Pedido'}
            <ShoppingBag className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <AnimatePresence>
        {showModal && (
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Pedido Confirmado!</DialogTitle>
                <DialogDescription>
                  Seu pedido foi realizado com sucesso. Número do pedido: {orderId}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <h3 className="font-semibold mb-2">Resumo do Pedido:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {products.map(item => (
                    <li key={item.id}>{item.quantity}x {item.title}</li>
                  ))}
                </ul>
                <p className="mt-4 font-semibold">Total: R$ {Number(finalTotal).toFixed(2)}</p>
              </div>
              <DialogFooter>
                <Button onClick={sendWhatsApp} className="w-full bg-green-500 hover:bg-green-600 text-white">
                  Enviar pedido via WhatsApp
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}