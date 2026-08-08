import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import ConditionalShell from '@/components/layout/ConditionalShell';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fiosefitas.com.br'),
  title: 'Fios e Fitas — Artesanato Personalizado',
  description: 'Laços, bolsas e crochês feitos à mão com amor. Peças artesanais 100% personalizadas.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Fios e Fitas',
    description: 'Peças artesanais personalizadas em crochê, laços e acessórios.',
    url: '/',
    siteName: 'Fios e Fitas',
    locale: 'pt_BR',
    type: 'website',
  },
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
