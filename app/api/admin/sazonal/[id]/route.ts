import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// UPDATE coleção
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  try {
    const updated = await prisma.collection.update({
    where: { id },
    data: {
        ...(body.titulo !== undefined && {
        titulo: body.titulo,
        }),

        ...(body.capa !== undefined && {
        capa: body.capa,
        }),
    },
    });

    if (Array.isArray(body.produtoIds)) {
      await prisma.collectionProduct.deleteMany({
        where: { collectionId: id },
      });

      await prisma.collectionProduct.createMany({
        data: body.produtoIds.map((productId: string) => ({
          collectionId: id,
          productId,
        })),
      });
    }

    return NextResponse.json({
      id: updated.id,
      titulo: updated.titulo,
      capa: updated.capa,
      produtoIds: body.produtoIds ?? [],
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Erro ao atualizar coleção" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.collectionProduct.deleteMany({
      where: { collectionId: id },
    });

    await prisma.collection.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Erro ao deletar coleção" },
      { status: 500 }
    );
  }
}