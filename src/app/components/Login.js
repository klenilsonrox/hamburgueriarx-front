'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import 'react-toastify/dist/ReactToastify.css'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Preencha todos os campos")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/login", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log(response)

      const data = await response.json()
      
      if(data.isAdmin) {
         setTimeout(() => {
          router.push("/admin")
        }, 500)
      }

      if (data.error) {
        toast.error(data.error || "Erro ao entrar")
      } 
      if (response.status === 200) {
        toast.success("Login realizado")
        setEmail("")
        setPassword("")
        setTimeout(() => {
          router.push("/cardapio")
        }, 500)
        return
      }
    } catch (error) {
      console.error(error)
      toast.error("Ocorreu um erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-background'>
      <ToastContainer />
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center text-primary'>Entrar</CardTitle>
          <CardDescription className='text-center'>Acesse sua conta para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Seu e-mail" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Sua senha" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className='w-full bg-red-600 hover:bg-red-700' 
              disabled={loading}
            >
              {loading ? "Carregando..." : "Acessar sua conta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-2'>
          <Link href="esqueci-senha" className='text-sm text-red-600 hover:underline'>
            Esqueci minha senha
          </Link>
          <p className='text-sm text-center'>
            Não possui conta?{' '}
            <Link href="/auth/cadastrar" className='text-red-600 font-medium hover:underline'>
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}