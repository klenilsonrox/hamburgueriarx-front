'use client'
import { createContext, useContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isMounted, setIsMounted] = useState(false); // Estado para verificar se o componente está montado
  const [observacao, setObservacao] = useState(null);

  // Carregar o carrinho do localStorage quando o componente for montado
  useEffect(() => {
    setIsMounted(true);
    const savedCart = typeof window !== 'undefined' && localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Salvar o carrinho no localStorage sempre que ele mudar
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (product, qtd) => {
    const produtoToCart = {
      productId: product.id,
      title: product.title,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: qtd,
      observacao: observacao,
    };

    const productInCart = cart.find(item => item.productId === product.id);

    if (productInCart) {
      setCart(
        cart.map(item => item.productId === product.id 
          ? { ...productInCart, quantity: productInCart.quantity += qtd } 
          : item
        )
      );
    } else {
      setCart([...cart, produtoToCart]);
    }

    setObservacao(null);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const aumentarQtd = (productId) => {
    setCart(
      cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const diminuirQtd = (productId) => {
    const productInCart = cart.find(item => item.productId === productId);

    if (productInCart.quantity > 1) {
      setCart(
        cart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      removeFromCart(productId);
    }
  };

  // Evitar renderizar o conteúdo até que o componente esteja montado no cliente
  if (!isMounted) {
    return null;
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, aumentarQtd, diminuirQtd, setObservacao }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
