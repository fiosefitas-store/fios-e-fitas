import { NextResponse } from 'next/server';
import produtosData from '@/data/produtos.json';

export async function GET() {
  // Temporary: return data from produtos.json until DB migration is done.
  return NextResponse.json(produtosData);
}
