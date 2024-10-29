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
  SelectValue,
} from "@/components/ui/select"
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
    <div className="p-4 max-w-2xl mx-auto">
      <ToastContainer />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Adicionar Novo Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Produto</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Digite o título do produto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Digite a descrição do produto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="Digite o preço do produto"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select onValueChange={(value) => setCategoryId(value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
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
            <div className="space-y-2">
              <Label htmlFor="image">Imagem do Produto</Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleSubmit} disabled={loading} className="w-full bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300">
            {loading ? 'Adicionando...' : 'Adicionar Produto'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AddProduct