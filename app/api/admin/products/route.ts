import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const produtos = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const produto = await prisma.product.create({
      data: {
        id: data.id,
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        categoria: data.categoria,
        subcategoria: data.subcategoria,
        imagem: data.imagem,
        imagens: data.cores,
        cores: data.cores,
        tamanhos: data.tamanhos,
        materiais: data.materiais,
        destaque: data.destaque ?? false,
        ativo: data.ativo ?? true,
        personalizado: data.personalizado ?? false,
        prazoProducao: data.prazoProducao,
        avaliacoes: data.reviewsCount ?? 0,
        vendas: data.vendas ?? 0,
      },
    });

    return NextResponse.json(produto, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar produto:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Produto com este ID já existe' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório' },
        { status: 400 }
      );
    }

    const produto = await prisma.product.update({
      where: { id },
      data: {
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        categoria: data.categoria,
        subcategoria: data.subcategoria,
        imagem: data.imagem,
        imagens: data.cores,
        cores: data.cores,
        tamanhos: data.tamanhos,
        materiais: data.materiais,
        destaque: data.destaque,
        ativo: data.ativo,
        personalizado: data.personalizado,
        prazoProducao: data.prazoProducao,
        avaliacoes: data.reviewsCount ?? data.avaliacoes,
        vendas: data.vendas ?? 0,
      },
    });

    return NextResponse.json(produto);
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    );
  }
}
