import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANTE
);

function extractPath(url: string) {
  const parts = url.split("/storage/v1/object/public/");
  return parts[1]?.replace("produtos/", "");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const produto = await prisma.product.findUnique({
      where: { id },
    });

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(produto);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const produto = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json(produto);
  } catch (error: any) {
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. buscar produto antes de deletar
    const produto = await prisma.product.findUnique({
      where: { id },
    });

    if (!produto) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // 2. montar lista de imagens
    const imagens: string[] = [];

    if (produto.imagem) {
      imagens.push(produto.imagem);
    }

    // se você tiver cores como JSON/array no Prisma:
    if ((produto as any).cores?.length) {
      imagens.push(
        ...(produto as any).cores.map((c: any) => c.imagem)
      );
    }

    // 3. deletar do Supabase Storage
    const paths = imagens
      .map(extractPath)
      .filter(Boolean);

    if (paths.length) {
      await supabase.storage
        .from("produtos")
        .remove(paths);
    }

    // 4. deletar produto no banco
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Produto e imagens removidos com sucesso",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao remover produto" },
      { status: 500 }
    );
  }
}