import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

export const metadata = {
  title: "Cardápio Hamburgueria RX",
  description: "Melhores Hamburguers do Brasil",
};

export default function LayoutCardapio({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
      <div className="min-h-screen">
      {children}
      </div>
      <Footer />
      </body>
    </html>
  );
}
