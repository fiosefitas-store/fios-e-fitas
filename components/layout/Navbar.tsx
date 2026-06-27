'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/data/categories';
import { useRouter } from 'next/navigation';
import Search from '@/components/home/Search'; 

export default function Navbar() {
  const { state, dispatch } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = state.items.reduce((acc, item) => acc + item.quantidade, 0);

  const router = useRouter();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const navLinks = CATEGORIES.map((c) => ({ 
    label: c.label, 
    href: `/categoria/${c.slug}`, 
    slug: c.slug, 
    subcategories: c.subcategories 
  }));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">

      {/* Main Navbar */}
      <nav
        className={cn(
          "h-20 bg-white transition-all duration-300 px-4 md:px-8 flex items-center",
          isScrolled ? "shadow-sm bg-white/90 backdrop-blur-md" : ""
        )}
      >
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between gap-4">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-[#3D261D]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="font-logo text-primary text-[1.75rem] leading-none absolute left-1/2 md:static md:left-auto transform -translate-x-1/2 md:translate-x-0">
            Fios e Fitas
          </Link>

          {/* CATEGORIAS */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#5C3D31] hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Icons & Search */}
          <div className="flex items-center gap-2 md:gap-4 text-[#5C3D31] flex-1 justify-end md:flex-initial">
            
            {/* 🔍 NOVO COMPONENTE DE BUSCA INSERIDO NO DESKTOP */}
            <div className="hidden md:block">
              <Search />
            </div>

            {/* Sacola de Compras */}
            <button 
              className="p-2 hover:text-primary transition-colors relative"
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 p-4 flex flex-col gap-4 max-h-[calc(100vh-104px)] overflow-y-auto">
          
          {/* 🔍 BUSCA DINÂMICA COMPATÍVEL COM O MENU MOBILE */}
          <div className="w-full pt-2 pb-1">
            <Search />
          </div>

          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-[#5C3D31] text-lg py-2 border-b border-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Submenu for desktop */}
      {openCategory && (
        <div className="hidden md:block bg-white border-t border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="grid grid-cols-12 gap-6 items-start">
              <div className="col-span-4">
                <h3 className="text-primary font-semibold text-lg mb-4">
                  {navLinks.find((n) => n.slug === openCategory)?.label}
                </h3>

                <ul className="space-y-4">
                  {navLinks.find((n) => n.slug === openCategory)?.subcategories.map((s: string) => (
                    <li key={s}>
                      <Link
                        href={`/categoria/${openCategory}/${encodeURIComponent(s.toLowerCase().replace(/\s+/g, '-'))}`}
                        onClick={() => setOpenCategory(null)}
                        className="text-[#3D261D] text-lg font-medium hover:text-primary transition-colors"
                      >
                        {s}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-8">
                {/* espaço visual — aqui pode entrar imagem, banners ou categorias em destaque */}
              </div>

              <div className="col-span-12 flex justify-end mt-4">
                <button onClick={() => setOpenCategory(null)} className="text-sm text-[#A67C6D]">Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}