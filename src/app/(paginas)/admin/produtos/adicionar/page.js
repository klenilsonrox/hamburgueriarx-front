'use client'

import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { FileImage, FolderPlus } from 'lucide-react'
import { getToken } from '@/app/actions/getToken'
import { baseURl } from '../../../../../../baseUrl'

const AddProduct = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [image, setImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/categorias')
        const data = await response.json()
        setCategories(data.categories)
        setLoading(false)
      } catch (error) {
        console.error("Erro ao buscar categorias:", error)
        toast.error('Erro ao carregar categorias')
      }finally{
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('categoryId', categoryId)
    if (image) {
      formData.append('imageUrl', image)
    }

    try {
      const token = await getToken()
      setLoading(true)
      const response = await fetch(`${baseURl}/products`, { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      const data = await response.json()
      console.log(response.status)
      if (response.status===201) {
        toast.success('Produto adicionado com sucesso!')
        // Reset form
        setTitle('')
        setDescription('')
        setPrice('')
        setCategoryId('')
        setImage(null)
        setTimeout(()=>{
            window.location.href = '/admin'
        },800)
      } else {
        throw new Error(data.error || 'Erro ao adicionar produto')
      }
    } catch (error) {
      console.error("Erro ao adicionar produto:", error)
      toast.error('Erro ao adicionar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=" bg-gray-50 flex items-center justify-center p-4 ">
      <ToastContainer />
      <Card className="w-full max-w-xl shadow-lg border-none">
        <CardHeader className="bg-[#EA1D2C] text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center">
            <FolderPlus className="mr-3 w-6 h-6" />
            Adicionar Novo Produto
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700">Título do Produto</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Digite o título do produto"
                className="focus:ring-[#EA1D2C] focus:border-[#EA1D2C]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Digite a descrição do produto"
                className="focus:ring-[#EA1D2C] focus:border-[#EA1D2C] min-h-[120px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-700">Preço</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="R$ 0,00"
                  step="0.01"
                  className="focus:ring-[#EA1D2C] focus:border-[#EA1D2C]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-700">Categoria</Label>
                <Select onValueChange={(value) => setCategoryId(value)} required>
                  <SelectTrigger className="focus:ring-[#EA1D2C] focus:border-[#EA1D2C]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categorias</SelectLabel>
                      {categories && categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image" className="text-gray-700">Imagem do Produto</Label>
              <div className="flex items-center space-x-3">
                <Input
                  id="image"
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <label 
                  htmlFor="image" 
                  className="flex items-center px-4 py-2 bg-[#EA1D2C]/10 text-[#EA1D2C] rounded-md cursor-pointer hover:bg-[#EA1D2C]/20 transition-colors"
                >
                  <FileImage className="mr-2 w-5 h-5" />
                  Selecionar Imagem
                </label>
                {image && <span className="text-sm text-gray-600">{image.name}</span>}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="bg-gray-100 p-6 rounded-b-lg">
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={loading} 
            className="w-full bg-[#EA1D2C] hover:bg-[#C7162B] text-white disabled:bg-[#EA1D2C]/50 transition-colors"
          >
            {loading ? 'Adicionando...' : 'Adicionar Produto'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AddProduct