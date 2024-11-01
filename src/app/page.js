'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Phone, MapPin, Instagram } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Footer from './components/Footer'

import Header from './components/Header'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="relative h-screen flex items-center overflow-hidden">
          <Image
            src="/artesanal.avif"
            alt="Hambúrguer artesanal suculento"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                HamburgueriaRx<span className="text-red-500">.</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Descubra o sabor autêntico dos nossos hambúrgueres artesanais, 
                preparados com ingredientes frescos e paixão pela culinária.
              </p>
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                <Link href="/cardapio">Ver Cardápio</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Sabor e Qualidade em Cada Mordida
                </h2>
                <p className="text-gray-600 mb-6">
                  Na HamburgueriaRx, combinamos ingredientes premium com técnicas 
                  artesanais para criar hambúrgueres que são verdadeiras obras de arte 
                  gastronômicas. Cada hambúrguer é uma experiência única, 
                  cuidadosamente elaborada para satisfazer até os paladares mais exigentes.
                </p>
                <ul className="space-y-2">
                  {['Carne 100% Angus', 'Pães artesanais', 'Molhos caseiros', 'Opções vegetarianas'].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center text-gray-700"
                    >
                      <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative h-80 md:h-full"
              >
                <Image
                  src="/burger.png"
                  alt="Ingredientes frescos para hambúrgueres"
                  fill
                  className="object-cover rounded-lg shadow-xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Entre em Contato</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                <Phone className="mr-2 h-4 w-4" /> (31) 99231-1170
              </Button>
              <Button size="lg" variant="outline">
                <MapPin className="mr-2 h-4 w-4" /> Localização
              </Button>
              <Button size="lg" variant="outline">
                <Instagram className="mr-2 h-4 w-4" /> @hamburgueriarx
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}