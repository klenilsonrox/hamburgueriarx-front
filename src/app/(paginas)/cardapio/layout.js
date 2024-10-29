import Categorias from "@/app/components/Categorias";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { CartProvider } from "@/app/contexts/CartContext";

export const metadata = {
  title: "Cardápio Hamburgueria RX",
  description: "Melhores Hamburguers do Brasil",
};

export default function LayoutCardapio({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>
        <Header />
        <div className="max-w-7xl mx-auto mt-4">
        <Categorias />
        </div>
       <div className="min-h-screen">
       {children}
       </div>
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}
