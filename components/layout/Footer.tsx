'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#3D261D] to-[#5C3D31] text-white py-12 px-4 md:px-8 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="font-logo text-[#FAC9A8] text-3xl mb-4 block">
            Fios e Fitas
          </Link>
          <p className="text-[#A67C6D] max-w-sm mb-6">
            Laços, bolsas e crochês feitos à mão com amor. Peças artesanais 100% personalizadas para momentos especiais.
          </p>
        </div>
        
        <div>
          <h4 className="font-display text-lg mb-4 text-[#F7C5D0]">Categorias</h4>
          <ul className="space-y-2 text-[#A67C6D]">
            <li><Link href="/categoria/lacos" className="hover:text-white transition-colors">Laços</Link></li>
            <li><Link href="/categoria/bolsas" className="hover:text-white transition-colors">Bolsas</Link></li>
            <li><Link href="/categoria/linha-bebe" className="hover:text-white transition-colors">Linha Bebê</Link></li>
            <li><Link href="/categoria/amiguru" className="hover:text-white transition-colors">Amiguru</Link></li>
            <li><Link href="/categoria/kits-presente" className="hover:text-white transition-colors">Kits Presente</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-display text-lg mb-4 text-[#F7C5D0]">Contato</h4>
          <ul className="space-y-2 text-[#A67C6D]">
            <li>WhatsApp: (83) 99866-0454</li>
            <li>Instagram: @fiosefitas.artesanato</li>
            <li className="pt-4"><Link href="/admin" className="text-sm opacity-50 hover:opacity-100 transition-opacity">Área do Administrador</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-[#A67C6D] text-sm">
        © 2025 Fios e Fitas. Todos os direitos reservados.
      </div>
    </footer>
  );
}
