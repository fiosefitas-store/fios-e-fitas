'use client';

import HeroBanner from '@/components/home/HeroBanner';
import CategoriasDestaque from '@/components/home/CategoriasDestaque';
import ProdutosDestaque from '@/components/home/ProdutosDestaque';
import Depoimentos from '@/components/home/Depoimentos';
import InstagramSection from '@/components/home/InstagramSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <ProdutosDestaque />
      <CategoriasDestaque />
      <Depoimentos />
      <InstagramSection />
    </div>
  );
}
