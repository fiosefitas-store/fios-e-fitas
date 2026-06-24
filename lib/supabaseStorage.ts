import { supabase } from "@/lib/supabase";

function extractPathFromUrl(url: string) {
  const parts = url.split("/storage/v1/object/public/");
  return parts[1]; // produtos/...
}

export async function deleteImageFromStorage(url: string) {
  const path = extractPathFromUrl(url);

  const { error } = await supabase.storage
    .from("produtos")
    .remove([path.replace("produtos/", "")]);

  if (error) {
    console.error("Erro ao deletar imagem:", error.message);
  }
}