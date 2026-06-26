'use client';

import HeroBanner from '@/components/home/HeroBanner';
import CategoriasDestaque from '@/components/home/BannerSazonais';
import ProdutosDestaque from '@/components/home/ProdutosDestaque';
import Depoimentos from '@/components/home/Depoimentos';
import InstagramSection from '@/components/home/InstagramSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="order-1">
        <HeroBanner />
      </div>

      {/* No mobile vem antes, no desktop continua depois */}
      <div className="order-2 md:order-3">
        <ProdutosDestaque />
      </div>

      {/* No mobile vem depois, no desktop volta para a posição original */}
      <div className="order-3 md:order-2">
        <CategoriasDestaque />
      </div>

      <div className="order-4">
        <Depoimentos />
      </div>

      <div className="order-5">
        <InstagramSection />
      </div>
    </div>
  );
}
