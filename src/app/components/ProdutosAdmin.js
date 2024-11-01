'use client'
import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogClose 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Camera, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { baseURl } from '../../../baseUrl';
import { getToken } from '../actions/getToken';
import { useRouter } from 'next/navigation';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
const router = useRouter()

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/produtos?page=${currentPage}&limit=12`);
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  function addProd(){
    router.push("/admin/produtos/adicionar")
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categorias');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      toast.error('Erro ao carregar categorias');
      console.error(error);
    }
  };

  const handleImageUpload = (e) => {
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
  };

  const handleProductUpdate = async () => {
    if (!selectedProduct) return;

    const formData = new FormData();
    formData.append('title', selectedProduct.title);
    formData.append('description', selectedProduct.description);
    formData.append('price', selectedProduct.price);
    formData.append('categoryId', selectedProduct.categoryId);

    if (selectedProduct.imageFile) {
      formData.append('imageUrl', selectedProduct.imageFile);
    }

    try {
      setLoading(true);
      const token =await getToken();
      const response = await fetch(`${baseURl}/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Produto atualizado com sucesso!');
        fetchProducts();
        setEditModalOpen(false);
      } else {
        toast.error('Erro ao atualizar produto');
      }
    } catch (error) {
      toast.error('Erro ao atualizar produto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductDelete = async () => {
    const token = await getToken()
    if (!selectedProduct) return;

    try {
      setLoading(true);
      const response = await fetch(`${baseURl}/products/${selectedProduct.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }
      });


      console.log(response)
      console.log(response.status)

      if (response.status===200) {
        toast.success('Produto deletado com sucesso!');
        fetchProducts();
        return
      } else {
        toast.error('Erro ao deletar produto');
      }
    } catch (error) {
      toast.error('Erro ao deletar produto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (product) => {
    try {
      setLoading(true);
      const token = await getToken()
      const newStatus = product.status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
      const response = await fetch(`${baseURl}/products/${product.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json()
      console.log(data)

      if (response.ok) {
        fetchProducts();
        toast.success(`Produto ${newStatus === 'AVAILABLE' ? 'disponibilizado' : 'indisponibilizado'}`);
      } else {
        toast.error('Erro ao atualizar status');
      }
    } catch (error) {
      toast.error('Erro ao atualizar status');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">

{loading && <div className='w-full max-w-7xl'>
<div className='flex justify-between w-full flex-col lg:flex-row max-w-7xl'>
  <Skeleton className="w-[300px] h-8 rounded-lg bg-gray-200 mb-3" /> 
  <Skeleton className="w-[200px] h-8 rounded-lg bg-red-300 mb-3" /> 
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(12)].map((_, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-4 pb-0">
              <Skeleton className="w-full h-48 rounded-lg" />
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

</div>}

      <Toaster richColors />
      
      {!loading && <div className="flex justify-between flex-col lg:flex-row lg:items-center mb-8">
        <h1 className=" text:2xl lg:text-4xl font-bold text-gray-800 text-center lg:text-left">Gerenciamento de Produtos</h1>
        <Button className="bg-red-600 hover:bg-red-700 mt-3 lg:mt-0" onClick={addProd}>Adicionar Novo Produto</Button>
      </div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {!loading && products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="relative p-4 pb-0">
              <div className="relative group ">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-300 rounded-lg">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setSelectedProduct(product);
                            setEditModalOpen(true);
                          }}
                        >
                          <Edit2 className="text-white" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Editar Produto</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{product.title}</h2>
                  <p className="text-green-600 font-bold text-lg">
                    R$ {parseFloat(product.price).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => toggleProductStatus(product)}
                        >
                          {product.status === 'AVAILABLE' ? (
                            <Eye className="text-green-500" />
                          ) : (
                            <EyeOff className="text-red-500" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {product.status === 'AVAILABLE' ? 'Disponível' : 'Indisponível'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente o produto.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleProductDelete} className="bg-red-500 hover:bg-red-600">
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {!loading && <div className="flex justify-center items-center space-x-4 mt-8">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </Button>
        <span className="text-sm text-gray-500">
          Página {currentPage} de {totalPages}
        </span>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </Button>
      </div>}

      {/* Edit Product Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid lg:grid-cols-2 gap-6 ">
              <div>
                <div 
                  className="relative group mb-4 cursor-pointer"
                  onClick={() => document.getElementById('product-image-upload').click()}
                >
                  <img 
                    src={selectedProduct.imagePreview || selectedProduct.imageUrl} 
                    alt={selectedProduct.title} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <input 
                    type="file" 
                    id="product-image-upload"
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Input 
                  placeholder="Título do Produto"
                  value={selectedProduct.title}
                  onChange={(e) => setSelectedProduct({
                    ...selectedProduct, 
                    title: e.target.value
                  })}
                />
                <Textarea 
                  placeholder="Descrição do Produto"
                  value={selectedProduct.description}
                  onChange={(e) => setSelectedProduct({
                    ...selectedProduct, 
                    description: e.target.value
                  })}
                  className="h-32"
                />
                <div className="flex space-x-4">
                  <Input 
                    type="number"
                    placeholder="Preço"
                    value={selectedProduct.price}
                    onChange={(e) => setSelectedProduct({
                      ...selectedProduct, 
                      price: e.target.value
                    })}
                    className="flex-1"
                  />
                  <Select 
                    value={selectedProduct.categoryId}
                    onValueChange={(value) => setSelectedProduct({
                      ...selectedProduct, 
                      categoryId: value
                    })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button 
            className="bg-red-500 hover:bg-red-600"
              onClick={handleProductUpdate}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;