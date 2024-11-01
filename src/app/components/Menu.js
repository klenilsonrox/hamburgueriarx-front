'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { User, ShoppingBag, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserContext } from '../contexts/UserContext'
import { logout } from '../actions/logout'

const itemsMenu = [
  { id: 1, name: "Início", link: "/" },
  { id: 2, name: "Cardápio", link: "/cardapio" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useUserContext()

  const handleLogout = async () => {
    await logout()
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Hamburgueria RX Logo" width={120} height={80} />
           
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {itemsMenu.map((item) => (
              <Link key={item.id} href={item.link} className="text-gray-700 hover:text-red-600 transition duration-300">
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/carrinho" className="text-gray-700 hover:text-red-600 transition duration-300">
              <ShoppingBag className="h-6 w-6" />
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Olá, {user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/pedidos">Pedidos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dados-cadastrais">Meus dados</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/auth/entrar" className="text-gray-700 hover:text-red-600 transition duration-300">
                  Entrar
                </Link>
                <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                  <Link href="/auth/cadastrar">Cadastrar</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              className="md:hidden"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden"
          >
            <nav className="flex flex-col space-y-4 px-4 py-6 bg-white border-t">
              {itemsMenu.map((item) => (
                <Link key={item.id} href={item.link} className="text-gray-700 hover:text-red-600 transition duration-300">
                  {item.name}
                </Link>
              ))}
              {!user && (
                <>
                  <Link href="/auth/entrar" className="text-gray-700 hover:text-red-600 transition duration-300">
                    Entrar
                  </Link>
                  <Link href="/auth/cadastrar" className="text-gray-700 hover:text-red-600 transition duration-300">
                    Cadastrar
                  </Link>
                </>
              )}
              {user && (
                <>
                  <Link href="/pedidos" className="text-gray-700 hover:text-red-600 transition duration-300">
                    Pedidos
                  </Link>
                  <Link href="/dados-cadastrais" className="text-gray-700 hover:text-red-600 transition duration-300">
                    Meus dados
                  </Link>
                  <button onClick={handleLogout} className="text-left text-gray-700 hover:text-red-600 transition duration-300">
                    Sair
                  </button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}