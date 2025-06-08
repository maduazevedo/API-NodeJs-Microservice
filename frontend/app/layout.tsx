import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"], // Especifique os pesos que você precisa
  subsets: ["latin"], // Escolha os subsets apropriados
  display: "swap", // Para melhor performance
  variable: "--font-roboto", // Opcional: para usar como CSS variable
});

export const metadata: Metadata = {
  title: "Projeto DevWeb2",
  description: "Projeto criado por Arthur de Oliveira e Maria Eduarda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}  antialiased`}>{children}</body>
    </html>
  );
}
