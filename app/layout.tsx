import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFab from '@/components/layout/WhatsAppFab';
import CartSidebar from '@/components/cart/CartSidebar';

export const metadata: Metadata = {
  title: 'Fios e Fitas — Artesanato Personalizado',
  description: 'Laços, bolsas e crochês feitos à mão com amor. Peças artesanais 100% personalizadas.',
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#F4845F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppFab />
          <CartSidebar />
        </Providers>
      </body>
    </html>
  );
}
