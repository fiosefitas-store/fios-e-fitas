import ProductCard from '@/components/produto/ProductCard';
import produtosData from '@/data/produtos.json';

export const metadata = {
  title: 'Todos os Produtos',
};

export default function TodosPage() {
  const produtos = produtosData.filter((p) => p.ativo !== false);

  return (
    <main className="py-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      <h1 className="font-display text-4xl text-[#3D261D] mb-8 uppercase">Todos os Produtos</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {produtos.map((produto) => (
          <div key={produto.id} className="w-full">
            <ProductCard produto={produto as any} />
          </div>
        ))}
      </div>
    </main>
  );
}
