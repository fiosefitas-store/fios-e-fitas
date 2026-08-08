import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const getBaseUrl = () => {
  const value =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://www.fiosefitas.com.br";

  return value.replace(/\/$/, "");
};

const toUrl = (baseUrl: string, path = "") => {
  return new URL(path, `${baseUrl}/`).toString();
};

const buildSlug = (value: string) => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const categorySlugs = [
    "lacos",
    "bolsas",
    "linha-bebe",
    "amigurumi",
    "kits-presente",
  ];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: toUrl(baseUrl),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: toUrl(baseUrl, "/todos"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: toUrl(baseUrl, "/home/destaques"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...categorySlugs.map((slug) => ({
      url: toUrl(baseUrl, `/categoria/${slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  const hasDatabase = Boolean(process.env.DATABASE_URL);

  if (!hasDatabase) {
    return staticPages;
  }

  const [products, collections] = await Promise.all([
    prisma.product.findMany({
      where: {
        ativo: true,
      },
      select: {
        id: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.collection.findMany({
      select: {
        id: true,
        titulo: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const productPages = products.map((product) => ({
    url: toUrl(baseUrl, `/produto/${product.id}`),
    lastModified: product.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const collectionPages = collections.map((collection) => ({
    url: toUrl(
      baseUrl,
      `/colecao/${buildSlug(collection.titulo) || collection.id}`
    ),
    lastModified: collection.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...collectionPages,
  ];
}