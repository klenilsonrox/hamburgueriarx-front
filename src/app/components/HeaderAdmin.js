'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ShoppingBag,
  PlusCircle,
  List,
  FileText,
  ChevronRight,
  ChevronLeft,
  Menu,
  LogOut
} from 'lucide-react'
import { logout } from '../actions/logout'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const HeaderAdmin = () => {
  const [collapsed, setCollapsed] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { href: "/admin", label: "Produtos", icon: ShoppingBag },
    { href: "/admin/produtos/adicionar", label: "Add Produto", icon: PlusCircle },
    { href: "/admin/categorias", label: "Categorias", icon: List },
    { href: "/admin/categorias/adicionar", label: "Add Categoria", icon: PlusCircle },
    { href: "/admin/pedidos", label: "Pedidos", icon: FileText },
  ]
  
  async function sair() {
    await logout()
    router.push("/auth/entrar")
  }

  
 const closeMenu = () => {  
    setCollapsed(false)
  }

  const NavContent = () => (
    <>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start ",
                    pathname === item.href && "bg-gray-200 "
                  )}
                >
                  <item.icon className={cn("h-5 w-5 mr-2", collapsed && "mr-0")} />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <Button variant="outline" className="w-full" onClick={sair}>
          <LogOut className={cn("h-5 w-5 mr-2", collapsed && "mr-0")} />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-30">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="py-4">
              <h1 className="text-xl font-bold px-4 mb-4">Painel Admin</h1>
              <NavContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Menu */}
      <div className={cn(
        "bg-gray-100 h-screen border-r text-gray-700 flex flex-col transition-all duration-300 sticky top-0 z-20 hidden lg:flex",
        collapsed ? "w-[80px]" : "w-[240px]"
      )}>
        <div className="p-4 flex justify-between items-center">
          {!collapsed && <h1 className="text-xl font-bold">Painel Admin</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <NavContent />
      </div>
    </>
  )
}

export default HeaderAdmin