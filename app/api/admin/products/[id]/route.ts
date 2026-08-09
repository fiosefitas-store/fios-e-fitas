import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


function extractPath(value: string): string | null {
  if (!value || typeof value !== "string") {
    return null;
  }

  // Se já for um path do Storage
  if (!value.includes("/storage/v1/object/public/")) {
    return value.replace(/^produtos\//, "");
  }

  const marker = "/storage/v1/object/public/";

  const index = value.indexOf(marker);

  if (index === -1) {
    return null;
  }

  const pathCompleto = value.substring(index + marker.length);

  return pathCompleto.replace(/^produtos\//, "");
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
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(produto);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);

    return NextResponse.json(
      { error: "Erro ao buscar produto" },
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
    console.error("Erro ao atualizar produto:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
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

    // 1. Buscar produto
    const produto = await prisma.product.findUnique({
      where: { id },
    });

    if (!produto) {
      console.log("Produto não encontrado");

      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // 2. Montar lista das imagens
    const imagens: string[] = [];

    if (produto.imagem) {
      imagens.push(produto.imagem);
    }

    // Caso cores seja um campo JSON
    const cores = (produto as any).cores;

    if (Array.isArray(cores)) {
      for (const cor of cores) {
        if (cor?.imagem) {
          imagens.push(cor.imagem);
        }
      }
    }

    // 3. Converter URLs em paths do Storage
    const paths = imagens
      .map(extractPath)
      .filter((path): path is string => Boolean(path));

    // 4. Deletar imagens
    if (paths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("produtos")
        .remove(paths);

      if (storageError) {

        // Não vamos impedir a exclusão do produto
        // por causa de uma imagem que não conseguiu ser removida.
      } else {}
    }

    // 5. Deletar produto do banco

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Produto removido com sucesso",
    });
  } catch (error: any) {

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Erro ao remover produto",
        details:
          process.env.NODE_ENV === "development"
            ? error?.message
            : undefined,
      },
      { status: 500 }
    );
  }
}