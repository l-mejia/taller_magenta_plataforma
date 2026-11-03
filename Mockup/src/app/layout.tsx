import type { Metadata } from "next";
import { Inter, Science_Gothic } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { ContentProvider } from "@/context/ContentContext";
import { AdminLoginModal } from "@/components/admin/AdminLoginModal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const scienceGothic = Science_Gothic({
  variable: "--font-science-gothic",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Magenta — Espacio cultural en Barranco",
  description:
    "Magenta es un espacio cultural autogestionado en Barranco, Lima: exposiciones, tienda de arte y taller.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${scienceGothic.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white font-sans text-neutral-900">
        <AdminAuthProvider>
          <ContentProvider>
            <CartProvider>
              <Navbar />
              {children}
              <Footer />
              <CartDrawer />
              <AdminLoginModal />
            </CartProvider>
          </ContentProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
