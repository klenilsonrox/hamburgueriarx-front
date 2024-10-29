import HeaderAdmin from "@/app/components/HeaderAdmin";
import { global } from "styled-jsx/css";





export const metadata = {
  title: "Hamburgueria RX",
  description: "Melhores Hamburguers do Brasil",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
  
       <div className="flex">
       <HeaderAdmin />
   
   <div>
   {children}
   </div>
       </div>
      </body>
    </html>
  );
}