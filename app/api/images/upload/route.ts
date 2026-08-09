import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function limparTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const bucket = formData.get("bucket") as string | null;
    const produtoId = formData.get("produtoId") as string | null;
    const cor = formData.get("cor") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhuma imagem enviada" },
        { status: 400 }
      );
    }

    if (bucket !== "produtos" && bucket !== "sazonais") {
      return NextResponse.json(
        { error: "Bucket inválido" },
        { status: 400 }
      );
    }

    // Aceita somente imagens
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "O arquivo enviado não é uma imagem" },
        { status: 400 }
      );
    }

    // Converte File para Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Converte qualquer imagem para WebP
    const webpBuffer = await sharp(buffer)
      .webp({
        quality: 82,
        effort: 5,
      })
      .toBuffer();

    const nomeOriginal = file.name.replace(/\.[^/.]+$/, "");
    const nomeLimpo = limparTexto(nomeOriginal);

    let filePath: string;

    if (bucket === "produtos") {
      if (!produtoId || !cor) {
        return NextResponse.json(
          { error: "produtoId e cor são obrigatórios para produtos" },
          { status: 400 }
        );
      }

      const corLimpa = limparTexto(cor);

      filePath = `${produtoId}/cores/${produtoId}-${corLimpa}-${Date.now()}.webp`;
    } else {
      filePath = `sazonais/${Date.now()}-${nomeLimpo}.webp`;
    }

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, webpBuffer, {
        cacheControl: "31536000",
        contentType: "image/webp",
        upsert: false,
      });

    if (error) {
      console.error("Erro no Supabase:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const { data: publicUrl } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      path: data.path,
      url: publicUrl.publicUrl,
    });
  } catch (error) {
    console.error("Erro ao processar imagem:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao processar imagem",
      },
      { status: 500 }
    );
  }
}