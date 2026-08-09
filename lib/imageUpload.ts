function limparTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "");
}

export async function uploadImageToSupabase(
  file: File,
  produtoId: string,
  cor: string
): Promise<string | null> {
  try {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("bucket", "produtos");
    formData.append("produtoId", produtoId);
    formData.append("cor", cor);

    const response = await fetch("/api/images/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Erro no upload:", result.error);

      alert(`Erro no upload: ${result.error}`);

      return null;
    }

    return result.url;
  } catch (error) {
    console.error("Erro no upload:", error);

    alert(
      `Erro: ${
        error instanceof Error
          ? error.message
          : "Erro desconhecido"
      }`
    );

    return null;
  }
}

export function convertBase64ToFile(
  base64: string,
  fileName: string
): File {
  const arr = base64.split(",");

  const mime =
    arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";

  const bstr = atob(arr[1]);

  const n = bstr.length;

  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new File(
    [u8arr],
    fileName,
    {
      type: mime,
    }
  );
}

export async function uploadSazonalImageToSupabase(
  file: File
): Promise<string> {
  try {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("bucket", "sazonais");

    const response = await fetch("/api/images/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Erro no upload");
    }

    return result.url;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erro desconhecido"
    );
  }
}