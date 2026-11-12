import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const cat = await prisma.category.upsert({
    where: { slug: "suportes" },
    update: {},
    create: { name: "Suportes", slug: "suportes" },
  });

  const p = await prisma.product.upsert({
    where: { slug: "suporte-celular" },
    update: {},
    create: {
      name: "Suporte de celular",
      slug: "suporte-celular",
      description: "Suporte impresso em 3D, ajustável.",
      priceCents: 2990,
      categoryId: cat.id,
      media: {
        create: [{ type: "IMAGE", url: "https://placehold.co/600x600", position: 0 }],
      },
      stock: { create: [{ quantity: 10, reason: "estoque inicial" }] },
    },
  });
  console.log("Produto criado:", p.name);
}

main().finally(() => prisma.$disconnect());