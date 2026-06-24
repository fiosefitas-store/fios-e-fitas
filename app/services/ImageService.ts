import { supabase } from "@/lib/supabase";

export async function deleteImageFromSupabase(
  path: string,
  bucket: "produtos" | "sazonais" = "produtos"
) {
  if (!supabase) return;

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error("Erro ao deletar imagem:", error.message);
  }
}