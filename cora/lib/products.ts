import { prisma } from "@/lib/prisma";

export type CardProduct = {
  id: number;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string | null;
};

export const withImage = {
  media: { where: { type: "IMAGE" }, orderBy: { position: "asc" }, take: 1 },
} as const;

export function toCard(p: {
  id: number;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  media: { url: string }[];
}): CardProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    priceCents: p.priceCents,
    imageUrl: p.media[0]?.url ?? null,
  };
}

export async function getBestSellers(limit = 16): Promise<CardProduct[]> {
  // soma das quantidades vendidas em pedidos PAGOS, por produto
  const top = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: { order: { status: "PAID" } },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });
  const ids = top.map((t) => t.productId);

  const found = await prisma.product.findMany({
    where: { active: true, id: { in: ids } },
    include: withImage,
  });

  // mantém a ordem do ranking
  const byId = new Map(found.map((p) => [p.id, p]));
  const ranked = ids
    .map((id) => byId.get(id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  // enquanto não houver vendas, completa com os produtos mais recentes
  if (ranked.length < limit) {
    const extra = await prisma.product.findMany({
      where: { active: true, id: { notIn: ids } },
      include: withImage,
      orderBy: { createdAt: "desc" },
      take: limit - ranked.length,
    });
    ranked.push(...extra);
  }

  return ranked.map(toCard);
}
export async function getProductsByIds(ids: number[]): Promise<CardProduct[]> {
  if (ids.length === 0) return [];
  const found = await prisma.product.findMany({
    where: { active: true, id: { in: ids } },
    include: withImage,
  });
  return found.map(toCard);
}

export async function getRecommended(productIds: number[], limit = 8): Promise<CardProduct[]> {
  if (productIds.length > 0) {
    const tagRows = await prisma.productTag.findMany({
      where: { productId: { in: productIds } },
      select: { tagId: true },
    });
    const tagIds = [...new Set(tagRows.map((t) => t.tagId))];

    if (tagIds.length > 0) {
      const candidates = await prisma.product.findMany({
        where: {
          active: true,
          id: { notIn: productIds },
          tags: { some: { tagId: { in: tagIds } } },
        },
        include: { ...withImage, tags: { select: { tagId: true } } },
      });

      const wanted = new Set(tagIds);
      const scored = candidates
        .map((p) => ({ p, score: p.tags.filter((t) => wanted.has(t.tagId)).length }))
        .sort((a, b) => b.score - a.score);

      if (scored.length > 0) return scored.slice(0, limit).map(({ p }) => toCard(p));
    }
  }
  return getBestSellers(limit);
}