'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Cadastro = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [cep, setCep] = useState("")
  const [rua, setRua] = useState("")
  const [numero, setNumero] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [complemento, setComplemento] = useState("")
  const [referencia, setReferencia] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const fetchCep = async () => {
    if (cep.length !== 8) {
      toast.error("CEP deve ter 8 dígitos")
      return
    }
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (data.erro) {
        toast.error("CEP não encontrado")
        return
      }

      setRua(data.logradouro)
      setBairro(data.bairro)
      setCidade(data.localidade)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao buscar CEP")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !password || !whatsapp) {
      toast.error("Preencha todos os campos")
      return
    }

    if (password !== confirmPassword) {
      toast.error("As senhas precisam ser iguais")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/cadastro", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, whatsapp, cep, rua, numero, bairro, cidade, complemento, referencia }),
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error || "Erro ao cadastrar")
      } 
      if (response.status === 201) {
        toast.success("Cadastro realizado com sucesso")
        // Reset form fields
        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setWhatsapp("")
        setCep("")
        setRua("")
        setNumero("")
        setBairro("")
        setCidade("")
        setComplemento("")
        setReferencia("")
        router.push("/cardapio")
        return
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4'>
      <ToastContainer />
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">Cadastre-se</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input id="nome" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Seu nome completo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Seu email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">Whatsapp</Label>
              <Input id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} type="text" placeholder="Seu whatsapp" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input id="senha" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Sua senha" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmar-senha">Confirmar senha</Label>
                <Input id="confirmar-senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirme sua senha" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" value={cep} onChange={(e) => setCep(e.target.value)} onBlur={fetchCep} type="text" placeholder="Seu CEP" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rua">Rua</Label>
                <Input id="rua" value={rua} onChange={(e) => setRua(e.target.value)} type="text" placeholder="Nome da sua rua" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input id="numero" value={numero} onChange={(e) => setNumero(e.target.value)} type="text" placeholder="Número" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} type="text" placeholder="Seu bairro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} type="text" placeholder="Sua cidade" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input id="complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} type="text" placeholder="Complemento" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referencia">Referência</Label>
              <Input id="referencia" value={referencia} onChange={(e) => setReferencia(e.target.value)} type="text" placeholder="Referência" />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? 'Carregando...' : 'Cadastrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className='mt-4 text-sm'>
        Já tem uma conta? <Link href="/auth/entrar" className='text-red-600 font-semibold'>Faça login</Link>
      </p>
    </div>
  )
}

export default Cadastro