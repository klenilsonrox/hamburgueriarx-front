'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Image from 'next/image'
import { getToken } from '@/app/actions/getToken'
import { useRouter } from 'next/navigation'
import { baseURl } from '../../../../../../baseUrl'


const CreateCategory = () => {
  const [name, setName] = useState('')
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef(null)
const [loading,setLoading] = useState(false)
const router = useRouter()
  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setImage(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result) // Usado apenas para pré-visualização
        }
        reader.readAsDataURL(file)
      } else {
        toast.error("Selecione uma imagem.")
        e.target.value = null
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !image) {
      toast.error("Preencha todos os campos")
      return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('imageUrl', image) // A imagem já está no formato correto

    try {
      const token = await getToken()
      setLoading(true)
      const response = await fetch(`${baseURl}/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // Enviando formData diretamente
      })

      const data = await response.json()
      setLoading(false)
console.log(response.status)
      if(response.status===201){
        toast.success("Categoria criada com sucesso.")
        setLoading(false)
    setTimeout(() => {
      router.push('/admin/categorias')
    }, 1000)
    return
      }

      if (response.status===400) {
        toast.error("Já existe uma categoria com esse nome")
        setLoading(false)
        return
      }

   
      toast.success("Categoria criada com sucesso.")
      setName('')
      setImage(null)
      setPreviewUrl('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      toast.error("Falha ao criar categoria. Por favor, tente novamente.")
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Adicionar nova categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da categoria</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Digite o nome da categoria"
                required
              />
            </div>
            <div>
              <Label htmlFor="image">Imagem da categoria</Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                ref={fileInputRef}
                className="cursor-pointer"
                required
              />
            </div>
            {previewUrl && (
              <div className="mt-4">
                <Label>Image Preview</Label>
                <div className="relative h-48 w-full mt-2">
                  <Image
                    src={previewUrl}
                    alt="Category preview"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 disabled:bg-red-300" disabled={loading}>{loading ? 'Criando categoria...' : 'Criar categoria'}</Button>
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>
  )
}

export default CreateCategory
