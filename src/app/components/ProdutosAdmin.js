import React, { useState, useEffect } from 'react';
import { getToken } from '../actions/getToken';
import { toast, ToastContainer } from 'react-toastify';
import { FaCamera, FaChevronDown, FaChevronUp, FaEye, FaEyeSlash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { baseURl } from '../../../baseUrl';

function ProdutosAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 130;

  const nextPage = () => {
    if (currentPage < totalPages) {
        setCurrentPage(prevPage => prevPage + 1);
    }
};

const prevPage = () => {
    if (currentPage > 1) {
        setCurrentPage(prevPage => prevPage - 1);
    }
};

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/produtos?page=${currentPage}&limit=${limit}`);
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/categorias');
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }finally{
        setLoading(false)
      }
    };

    fetchProducts();
    fetchCategories();
  }, [currentPage]);

  const handleInputChange = (productId, field, value) => {
    const updatedProducts = products.map((product) =>
      product.id === productId ? { ...product, [field]: value } : product
    );
    setProducts(updatedProducts);
  };

  const handleImageChange = (productId, file) => {
    const updatedProducts = products.map((product) =>
      product.id === productId ? { ...product, imageUrl: file } : product
    );
    setProducts(updatedProducts);
  };

  const saveChanges = async (productId) => {
    const product = products.find((product) => product.id === productId);
    const formData = new FormData();

    formData.append('title', product.title);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('categoryId', product.categoryId);

    if (product.imageUrl instanceof File) {
      formData.append('imageUrl', product.imageUrl);
    }

    try {
      const token = await getToken();
      setLoading(true);
      const response = await fetch(`${baseURl}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success('Produto atualizado com sucesso!');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Erro ao salvar as alterações:", error);
      toast.error('Erro ao atualizar o produto!');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (productId) => {
    const fileInput = document.getElementById(`file-input-${productId}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  const toggleExpandProduct = (productId) => {
    setExpandedProduct(prev => (prev === productId ? null : productId));
  };

  const toggleProductStatus = async (productId) => {
    const product = products.find((product) => product.id === productId);
    const newStatus = product.status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';

    try {
      const token = await getToken();
      setLoading(true);
      const response = await fetch(`${baseURl}/products/${productId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.status === 200) {
        const updatedProducts = products.map((prod) =>
          prod.id === productId ? { ...prod, status: newStatus } : prod
        );
        setProducts(updatedProducts);
        toast.success(`Produto ${newStatus === 'AVAILABLE' ? 'disponível' : 'indisponível'} com sucesso!`);
      } else {
        toast.error('Erro ao atualizar o status do produto!');
      }
    } catch (error) {
      console.error("Erro ao atualizar o status:", error);
      toast.error('Erro ao atualizar o status do produto!');
    }finally{
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const token = await getToken();
      setLoading(true);
      const response = await fetch(`${baseURl}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setProducts(products.filter(product => product.id !== productId));
        toast.success('Produto deletado com sucesso!');
      } else {
        toast.error('Erro ao deletar o produto!');
      }
    } catch (error) {
      console.error("Erro ao deletar o produto:", error);
      toast.error('Erro ao deletar o produto!');
    } finally {
      setShowModal(false);
      setProductToDelete(null);
      setLoading(false);
    }
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto p-8">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Painel de Administração</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {products && products.map((product) => (
          <div key={product.id} className="border rounded-lg shadow-md overflow-hidden bg-white p-4">
            <input
              type="file"
              id={`file-input-${product.id}`}
              onChange={(e) => handleImageChange(product.id, e.target.files[0])}
              className="hidden"
            />
            {product.imageUrl && (
              <div className="relative mb-2" onClick={() => handleImageClick(product.id)}>
                <img
                  src={product.imageUrl instanceof File ? URL.createObjectURL(product.imageUrl) : product.imageUrl}
                  alt={product.title}
                  className="w-full h-32 object-cover rounded-md"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 p-2 rounded-full">
                    <FaCamera className="text-yellow-500 text-3xl opacity-100 hover:opacity-80 transition-opacity duration-300 cursor-pointer" />
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between relative">
              <input
                type="text"
                value={product.title}
                onChange={(e) => handleInputChange(product.id, 'title', e.target.value)}
                className="text-xl font-semibold text-gray-800 w-full mb-2 outline-none bg-gray-100 border pl-2 rounded-md"
              />
              <button onClick={() => toggleProductStatus(product.id)} className="ml-2 absolute right-0 bottom-16">
                {product.status === 'AVAILABLE' ? (
                  <FaEye className="text-green-500" />
                ) : (
                  <FaEyeSlash className="text-red-500" />
                )}
              </button>
              <button onClick={() => toggleExpandProduct(product.id)} className="ml-2">
                {expandedProduct === product.id ? (
                  <FaChevronUp className="text-gray-600" />
                ) : (
                  <FaChevronDown className="text-gray-600" />
                )}
              </button>
            </div>
            {expandedProduct === product.id && (
              <div>
                <textarea
                  value={product.description}
                  onChange={(e) => handleInputChange(product.id, 'description', e.target.value)}
                  className="text-sm text-gray-600 w-full outline-none bg-gray-100 border pl-2 rounded-md"
                  rows="3"
                />
                <div className="flex items-center gap-2 flex-col">
                  <p className='bg-gray-100 border pl-2 rounded-md w-full'>
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => handleInputChange(product.id, 'price', e.target.value)}
                      className="text-lg font-bold text-green-500 outline-none bg-gray-100 w-full"
                    />
                  </p>
                  <Select onValueChange={(value) => handleInputChange(product.id, 'categoryId', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button onClick={() => saveChanges(product.id)} className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 transition duration-200">
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button onClick={() => handleDeleteClick(product.id)} className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition duration-200">
                    Deletar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          variant={currentPage === 1 ? "secondary" : "default"}
        >
          Anterior
        </Button>
        
        <span className="font-semibold">Página {currentPage} de {totalPages}</span>

        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          variant={currentPage === totalPages ? "secondary" : "default"}
        >
          Próxima
        </Button>
      </div>

      {/* Modal de confirmação */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4">Confirmar Deleção</h2>
            <p>Você tem certeza que deseja deletar este produto?</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 mr-2">
                Cancelar
              </button>
              <button onClick={() => deleteProduct(productToDelete)} className="bg-red-500 text-white rounded-md px-4 py-2 disabled:bg-red-300" disabled={loading}>
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProdutosAdmin;
