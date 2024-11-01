'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2, Edit2, PlusCircle, ImagePlus } from 'lucide-react'
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
  const [imagePreview, setImagePreview] = useState(null)
const router = useRouter()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)



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
      setIsConfirmDeleteOpen(false)
    }
  }

  const handleAddCategory = () => {
    setEditName('')
    setEditImage(null)
    setImagePreview(null)
   router.push("/admin/categorias/adicionar")
    
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
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 w-3/4 mb-2"></div>
        <div className="flex justify-between">
          <div className="h-10 w-20 bg-gray-200"></div>
          <div className="h-10 w-20 bg-gray-200"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-4 sm:mb-0">Categorias</h1>
          <Button className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto" onClick={handleAddCategory}>
            <PlusCircle className="mr-2" /> Nova Categoria
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {loading ? (
            Array(8).fill(0).map((_, index) => <SkeletonCard key={index} />)
          ) : (
            categories && categories.map((category) => (
              <Card key={category.id} className="overflow-hidden transition-all hover:shadow-lg group">
                <CardContent className="p-0">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-4 flex flex-col space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {category.name}
                  </h2>
                  <div className="flex justify-between space-x-2 w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(category)} 
                      className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Edit2 className="mr-2 h-4 w-4" /> Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => openConfirmDeleteModal(category.id)}
                      className="flex-1"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Deletar
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-red-600">Editar Categoria</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nome da categoria"
                className="col-span-3 border-red-300 focus:border-red-500 focus:ring-red-500"
              />
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current.click()} 
                  variant="outline"
                  className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                >
                  {editImage ? 'Alterar Imagem' : 'Upload Imagem'}
                </Button>
                {editImage && <span className="text-sm text-gray-500">{editImage.name}</span>}
              </div>
              {imagePreview && (
                <div className="mt-4">
                  <Image src={imagePreview} alt="Preview" width={200} height={200} objectFit="cover" />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleEditSubmit} 
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

       

        {/* Delete Confirmation Dialog */}
        <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-red-600">Confirmar Deleção</DialogTitle>
            </DialogHeader>
            <p className="text-gray-600">Tem certeza de que deseja deletar esta categoria?</p>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsConfirmDeleteOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => handleDelete(categoryToDelete)} 
                variant="destructive"
              >
                Deletar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ToastContainer />
      </div>
    </div>
  )
}