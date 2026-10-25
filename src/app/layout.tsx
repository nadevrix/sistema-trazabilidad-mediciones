import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sistema de Trazabilidad de Mediciones · Ingenios Azucareros",
  description: "Control, registro y análisis de mediciones de rodillos de molienda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#f4f6fa] text-[#1e293b]">
        {children}
      </body>
    </html>
  );
}
