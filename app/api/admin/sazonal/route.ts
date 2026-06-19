import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - listar coleções
export async function GET() {
  const colecoes = await prisma.collection.findMany({
    include: {
      products: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatted = colecoes.map(
    (c: {
      id: string;
      titulo: string;
      capa: string | null;
      products: { productId: string }[];
    }) => ({
      id: c.id,
      titulo: c.titulo,
      capa: c.capa,
      produtoIds: c.products.map(
        (p: { productId: string }) => p.productId
      ),
    })
  );

  return NextResponse.json(formatted);
}

export async function POST(req: Request) {
  const body = await req.json();

  const novaColecao = await prisma.collection.create({
    data: {
      titulo: body.titulo,
      capa: body.capa ?? null,
    },
  });

  // Se vier produtos selecionados
  if (body.produtoIds?.length) {
    await prisma.collectionProduct.createMany({
      data: body.produtoIds.map((productId: string) => ({
        collectionId: novaColecao.id,
        productId,
      })),
    });
  }

  return NextResponse.json(
    {
      id: novaColecao.id,
      titulo: novaColecao.titulo,
      capa: novaColecao.capa,
      produtoIds: body.produtoIds ?? [],
    },
    { status: 201 }
  );
}