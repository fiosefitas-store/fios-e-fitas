import type { NextApiRequest, NextApiResponse } from "next";
import { createServiceSupabase } from "@/lib/supabase";

type ResponseData =
  | { url: string }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const supabase = createServiceSupabase();

    const { file } = req.body as { file: File | string };

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const fileName = `${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, file, {
        contentType: "image/jpeg",
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    return res.status(200).json({
      url: data.publicUrl,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || "Unexpected error",
    });
  }
}