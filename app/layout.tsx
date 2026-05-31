import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import ConditionalShell from '@/components/layout/ConditionalShell';

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
          <ConditionalShell>{children}</ConditionalShell>
        </Providers>
      </body>
    </html>
  );
}
