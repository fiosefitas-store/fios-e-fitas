import { supabase } from "./supabase";

export async function uploadImageToSupabase(
  file: File,
  produtoId: string,
  cor: string
): Promise<string | null> {
  if (!supabase) {
    console.error("Supabase não configurado");
    return null;
  }

  try {
    const fileName = `${produtoId}-${cor}-${Date.now()}.${file.name.split(".").pop()}`;
    const { data, error } = await supabase.storage
      .from("produtos")
      .upload(`${produtoId}/cores/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ Erro ao fazer upload:", error);
      console.error("Detalhes:", error.message);
      alert(`Erro no upload: ${error.message}`);
      return null;
    }

    console.log("✅ Upload bem-sucedido:", data);

    // Retorna a URL pública
    const { data: publicUrl } = supabase.storage
      .from("produtos")
      .getPublicUrl(data.path);

    console.log("🔗 URL pública:", publicUrl.publicUrl);
    return publicUrl.publicUrl;
  } catch (error) {
    console.error("❌ Erro ao fazer upload da imagem:", error);
    alert(`Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    return null;
  }
}

export function convertBase64ToFile(base64: string, fileName: string): File {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new File([u8arr], fileName, { type: mime });
}


export async function uploadSazonalImageToSupabase(file: File): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase não configurado");
  }

  const fileName = `sazonais/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("sazonais")
    .upload(fileName, file);

  if (error) throw new Error(error.message);

  const { data: publicUrl } = supabase.storage
    .from("sazonais")
    .getPublicUrl(data.path);

  return publicUrl.publicUrl;
}