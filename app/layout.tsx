import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import ConditionalShell from '@/components/layout/ConditionalShell';
import { DM_Sans, Playfair_Display, Pacifico } from 'next/font/google';

const dmSans = DM_Sans({
    subsets: ['latin'],
    variable: '--font-dm-sans',
    display: 'swap',
    weight: ['400', '500', '600'],
});

const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
    weight: ['400', '500', '600', '700'],
    style: ['normal', 'italic'],
});

const pacifico = Pacifico({
    subsets: ['latin'],
    variable: '--font-pacifico',
    display: 'swap',
    weight: '400',
});

export const metadata: Metadata = {
    metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fiosefitas.com.br'
    ),
    title: 'Fios e Fitas — Artesanato Personalizado',
    description:
    'Laços, bolsas e crochês feitos à mão com amor. Peças artesanais 100% personalizadas.',
    alternates: {
    canonical: '/',
    },
    openGraph: {
    title: 'Fios e Fitas',
    description:
    'Peças artesanais personalizadas em crochê, laços e acessórios.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${dmSans.variable} ${playfairDisplay.variable} ${pacifico.variable}`}
      >
        <Providers>
          <ConditionalShell>{children}</ConditionalShell>
        </Providers>
      </body>
    </html>
  );
}
