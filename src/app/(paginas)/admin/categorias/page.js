'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import Image from 'next/image'
import 'react-toastify/dist/ReactToastify.css'
import { toast, ToastContainer } from 'react-toastify'
import { getToken } from '@/app/actions/getToken'
import { baseURl } from '../../../../../baseUrl'
import { useRouter } from 'next/navigation'

export default function CategoryList() {
  const [categories, setCategories] = useState([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editName, setEditName] = useState('')
  const [editImage, setEditImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categorias')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error("Failed to load categories. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = await getToken()
      setLoading(true)
      const response = await fetch(`${baseURl}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error('Failed to delete category')
      setCategories(categories.filter(category => category.id !== id))
      toast.success("Categoria deletada com sucesso.")
    } catch (error) {
      console.error('Erro ao deletar categoria:', error)
      toast.error("Falha ao deletar categoria, por favor, tente novamente.")
    } finally {
      setLoading(false)
      setIsConfirmDeleteOpen(false) // Fechar modal de confirmação
    }
  }

  const openConfirmDeleteModal = (id) => {
    setCategoryToDelete(id)
    setIsConfirmDeleteOpen(true)
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setEditName(category.name)
    setEditImage(null)
    setIsEditDialogOpen(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setEditImage(file)
      } else {
        toast.error("Envie uma imagem.")
        e.target.value = null
      }
    }
  }

  const handleEditSubmit = async () => {
    if (!editingCategory) return
    const token = await getToken()
    try {
      const formData = new FormData()
      formData.append('name', editName)
      if (editImage) {
        formData.append('imageUrl', editImage)
      }
      setLoading(true)
      const response = await fetch(`${baseURl}/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (response.status === 200) {
        toast.success("Categoria atualizada com sucesso.")
        setTimeout(() => {
          setIsEditDialogOpen(false)
          window.location.href = "/admin/categorias"
        }, 1000)
        return
      }

      if (response.status !== 200) throw new Error('Falha ao atualizar categoria')
      const updatedCategories = categories.map(cat => 
        cat.id === editingCategory.id ? data : cat
      )
      setCategories(updatedCategories)
      setIsEditDialogOpen(false)
      toast.success("Categoria atualizada com sucesso.")
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error)
      toast.error("Já existe uma categoria com esse nome.")
    } finally {
      setLoading(false)
    }
  }

  const SkeletonCard = () => (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="h-48 w-full" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4" />
      </CardContent>
      <CardFooter className="p-4 flex justify-between gap-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Categorias</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(8).fill(0).map((_, index) => <SkeletonCard key={index} />)
        ) : (
          categories && categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle>{category.name}</CardTitle>
              </CardContent>
              <CardFooter className="p-4 flex justify-between gap-2">
                <Button variant="outline" onClick={() => handleEdit(category)}>Edit</Button>
                <Button variant="destructive" onClick={() => openConfirmDeleteModal(category.id)}>Delete</Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar categoria</DialogTitle>
          </DialogHeader>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Nome da categoria"
            className="mb-4"
          />
          <div className="mb-4">
            <Input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current.click()}>
              {editImage ? 'Escolha uma imagem' : 'Upload Image'}
            </Button>
            {editImage && <span className="ml-2">{editImage.name}</span>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleEditSubmit} className="bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Deleção */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Deleção</DialogTitle>
          </DialogHeader>
          <p>Tem certeza de que deseja deletar esta categoria?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>Cancelar</Button>
            <Button onClick={() => handleDelete(categoryToDelete)} variant="destructive">Deletar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </div>
  )
}
