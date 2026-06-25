import { supabase } from "@/lib/supabase";

function extractPathFromUrl(url: string) {
  // Trava para evitar o erro do split em URLs locais (blob:) ou indefinidas
  if (!url || typeof url !== "string" || url.startsWith("blob:")) {
    return null;
  }

  const parts = url.split("/storage/v1/object/public/");
  return parts[1] ?? null;
}

export async function deleteImageFromStorage(url: string) {
  if (!url || typeof url !== "string" || url.startsWith("blob:")) {
    console.warn("URL local ou inválida ignorada para deleção:", url);
    return;
  }

  const path = extractPathFromUrl(url);

  if (!path) {
    console.warn("Não foi possível extrair path da URL:", url);
    return;
  }

  // Remove o nome do bucket ("produtos/") do início do path se ele existir
  const cleanPath = path.startsWith("produtos/") ? path.replace("produtos/", "") : path;

  const { error } = await supabase.storage
    .from("produtos")
    .remove([cleanPath]);

  if (error) {
    console.error("Erro ao deletar imagem:", error.message);
  }
}