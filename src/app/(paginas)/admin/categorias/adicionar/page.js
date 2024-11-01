'use client'

import React, { useState, useRef, useEffect } from 'react'
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
import { Upload, ImagePlus } from 'lucide-react'

const CreateCategory = () => {
  const [name, setName] = useState('')
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function getUser() {
    const token = await getToken()
    console.log(token)
    const responseUser = await fetch(`${baseURl}/users/infos`, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      }
    })

    if (!responseUser.ok) {
      router.push('/auth/entrar')
    }

    const user = await responseUser.json()

    if (!user.isAdmin) {  
      router.push('/')
    }
  }

  useEffect(() => {
    getUser()
  }, [])

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
          setPreviewUrl(reader.result)
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
    formData.append('imageUrl', image)

    try {
      const token = await getToken()
      setLoading(true)
      const response = await fetch(`${baseURl}/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()
      setLoading(false)
      console.log(response.status)

      if (response.status === 201) {
        toast.success("Categoria criada com sucesso.")
        setLoading(false)
        setTimeout(() => {
          router.push('/admin/categorias')
        }, 1000)
        return
      }

      if (response.status === 400) {
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=" bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="bg-red-500 text-white rounded-t-xl">
          <CardTitle className="text-2xl font-bold text-center">
            Adicionar nova categoria
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-700">Nome da categoria</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Digite o nome da categoria"
                className="mt-2 border-gray-300 focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="image" className="text-gray-700 mb-2">Imagem da categoria</Label>
              <div className="relative">
                <Input
                  id="image"
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  ref={fileInputRef}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  required
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
                  {previewUrl ? (
                    <div className="w-full h-48 relative">
                      <Image
                        src={previewUrl}
                        alt="Category preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
                      <ImagePlus className="w-12 h-12 text-red-500" />
                      <p className="text-sm">Clique para selecionar uma imagem</p>
                      <p className="text-xs text-gray-400">Formatos suportados: PNG, JPG</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-red-500 hover:bg-red-600 text-white transition-colors" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando categoria...
              </div>
            ) : (
              'Criar categoria'
            )}
          </Button>
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>
  )
}

export default CreateCategory