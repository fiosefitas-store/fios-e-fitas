import { supabase } from "./supabase";

function limparTexto(texto: string) {
  return texto
    .normalize("NFD")                  // Separa os acentos das letras (ex: ô vira o + ^)
    .replace(/[\u0300-\u036f]/g, "")   // Remove os acentos
    .replace(/\s+/g, "-")              // Substitui espaços por hífen (-)
    .replace(/[^a-zA-Z0-9-_]/g, "");   // Remove qualquer outro caractere especial
}

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
    // 🌟 CORREÇÃO AQUI: Passando o nome da cor e o nome do arquivo pela limpeza de texto
    const corLimpa = limparTexto(cor);
    const extensao = file.name.split(".").pop() || "png";
    
    const fileName = `${produtoId}-${corLimpa}-${Date.now()}.${extensao}`;

    const { data, error } = await supabase.storage
      .from("produtos")
      .upload(`${produtoId}/cores/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Detalhes:", error.message);
      alert(`Erro no upload: ${error.message}`);
      return null;
    }

    // Retorna a URL pública
    const { data: publicUrl } = supabase.storage
      .from("produtos")
      .getPublicUrl(data.path);
      
    return publicUrl.publicUrl;
  } catch (error) {
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

  // 🌟 DICA EXTRA: Também limpa o nome do arquivo aqui para evitar erros na aba sazonal
  const extensao = file.name.split(".").pop() || "png";
  const nomeLimpo = limparTexto(file.name.replace(`.${extensao}`, ""));
  const fileName = `sazonais/${Date.now()}-${nomeLimpo}.${extensao}`;

  const { data, error } = await supabase.storage
    .from("sazonais")
    .upload(fileName, file);

  if (error) throw new Error(error.message);

  const { data: publicUrl } = supabase.storage
    .from("sazonais")
    .getPublicUrl(data.path);

  return publicUrl.publicUrl;
}