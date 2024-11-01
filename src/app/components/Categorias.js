'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Utensils } from 'lucide-react'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"



export default function Categorias() {
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    fetch('/api/categorias')
      .then(response => response.json())
      .then(data => setCategorias(data.categories))
  }, [])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="bg-red-600 text-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Nosso Cardápio</h1>
            <p className="text-sm text-red-100">Escolha seus favoritos</p>
          </div>
          <Utensils className="w-8 h-8" />
        </div>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              href={`/cardapio/categoria/${categoria.slug}`}
              className="flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity"
            >
              <div className="relative w-20 h-20 overflow-hidden rounded-full border-2 border-red-200">
                <Image
                  src={categoria.imageUrl}
                  alt={categoria.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-700">{categoria.name}</span>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      
    </div>
  )
}