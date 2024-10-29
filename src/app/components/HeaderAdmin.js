'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  List,
  FileText,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'

const HeaderAdmin = () => {
  const [collapsed, setCollapsed] = React.useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", label: "Produtos", icon: ShoppingBag },
    { href: "/admin/produtos/adicionar", label: "Adicionar Produto", icon: PlusCircle },
    { href: "/admin/categorias", label: "Categorias", icon: List },
    { href: "/admin/categorias/adicionar", label: "Adicionar Categoria", icon: PlusCircle },
    { href: "/admin/pedidos", label: "Pedidos", icon: FileText },
  ]

  return (
    <div className={cn(
      "bg-gray-100 h-screen border-r text-gray-700 flex flex-col transition-all duration-300 sticky top-0",
      collapsed ? "w-[80px]" : "w-[240px]"
    )}>
      <div className="p-4 flex justify-between items-center">
        {!collapsed && <h1 className="text-xl font-bold">Admin Panel</h1>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href && "bg-gray-200"
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
        <Button variant="outline" className="w-full">
          <LayoutDashboard className={cn("h-5 w-5 mr-2", collapsed && "mr-0")} />
          {!collapsed && <span>Dashboard</span>}
        </Button>
      </div>
    </div>
  )
}

export default HeaderAdmin