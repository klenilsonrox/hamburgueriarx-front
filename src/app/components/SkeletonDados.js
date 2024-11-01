'use client'

import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'
import { CartProvider } from '../contexts/CartContext'

export default function SkeletonDados() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <CartProvider>
      <div className="rounded-lg p-6 flex flex-col items-center">
        <ToastContainer />
        <h1 className="text-2xl font-bold text-center mb-6">Atualizar Dados</h1>
        <form className="w-full max-w-lg space-y-4">
          <SkeletonInput label="Nome Completo" />
          <div className="flex flex-col lg:flex-row gap-2">
            <SkeletonInput label="Email" disabled />
            <SkeletonInput label="WhatsApp" />
          </div>
          <div className="flex flex-col lg:flex-row gap-2">
            <SkeletonInput label="Cep" />
            <SkeletonInput label="Rua" />
          </div>
          <div className="flex flex-col lg:flex-row gap-2">
            <SkeletonInput label="Número" />
            <SkeletonInput label="Bairro" />
          </div>
          <div className="flex flex-col lg:flex-row gap-2">
            <SkeletonInput label="Cidade" />
            <SkeletonInput label="Complemento" />
          </div>
          <SkeletonInput label="Referência" />
          <div className="mt-4 flex items-center justify-between">
            <Link href="/cardapio" className="text-red-600 hover:text-red-500">
              Voltar
            </Link>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-400 px-6 py-3 rounded-md text-white transition duration-200"
              disabled={loading}
            >
              {loading ? "Carregando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </CartProvider>
  )
}

function SkeletonInput({ label, disabled = false }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        className={`h-10 bg-gray-200 rounded-md ${
          disabled ? 'opacity-50' : 'animate-pulse'
        }`}
        aria-hidden="true"
      ></div>
    </div>
  )
}