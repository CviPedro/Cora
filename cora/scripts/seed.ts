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
  for (let i = 1; i <= 16; i++) {
    await prisma.product.upsert({
      where: { slug: `produto-teste-${i}` },
      update: {},
      create: {
        name: `Produto teste ${i}`,
        slug: `produto-teste-${i}`,
        description: "Descrição de exemplo, só para testar o layout dos cards.",
        priceCents: 1990 + i * 500,
        categoryId: cat.id,
        media: {
          create: [{ type: "IMAGE", url: `https://placehold.co/600x600?text=${i}`, position: 0 }],
        },
        stock: { create: [{ quantity: 5, reason: "estoque inicial" }] },
      },
    });
  }
  const tagData = [
    { name: "Natalino", slug: "natalino" },
    { name: "Escritório", slug: "escritorio" },
    { name: "Cozinha", slug: "cozinha" },
    { name: "Decoração", slug: "decoracao" },
    { name: "Presentes", slug: "presentes" },
  ];
  const tags = await Promise.all(
    tagData.map((t) => prisma.tag.upsert({ where: { slug: t.slug }, update: {}, create: t }))
  );

  const all = await prisma.product.findMany({ select: { id: true } });
  for (const [idx, prod] of all.entries()) {
    await prisma.productTag.createMany({
      data: [
        { productId: prod.id, tagId: tags[idx % tags.length].id },
        { productId: prod.id, tagId: tags[(idx + 1) % tags.length].id },
      ],
      skipDuplicates: true,
    });
  }
  console.log("Produto criado:", p.name);

}

main().finally(() => prisma.$disconnect());