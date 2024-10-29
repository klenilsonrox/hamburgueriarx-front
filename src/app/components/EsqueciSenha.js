'use client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

const EsqueciSenha = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/esqueci-senha", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error || "Erro ao recuperar senha");
      }

      if (response.status === 200) {
        setSuccess("Email enviado, verifique seu email");
        toast.success("Email enviado, verifique seu email");
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6'>
      <ToastContainer />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">Esqueci minha senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Digite o email cadastrado" 
              />
            </div>
            <Button 
              className="w-full bg-red-600 hover:bg-red-700" 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Carregando..." : "Recuperar minha senha"}
            </Button>
          </form>
        </CardContent>
        {success && (
          <CardFooter>
            <p className='text-green-600 font-bold'>{success}</p>
          </CardFooter>
        )}
      </Card>
      <Link href="/auth/entrar" className='mt-4 text-red-600 hover:underline text-sm'>
        Voltar para o login
      </Link>
    </div>
  );
};

export default EsqueciSenha;