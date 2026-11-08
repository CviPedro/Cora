import Image from "next/image";

import { prisma } from "@/lib/prisma";

const brl = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default async function LojaPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { media: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Loja</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((p) => (
          <a key={p.id} href={`/produto/${p.slug}`} className="rounded border p-2">
            {p.media[0] && (
              <Image
                src={p.media[0].url}
                alt={p.name}
                width={400}
                height={400}
                unoptimized
                className="aspect-square w-full object-cover"
              />
            )}
            <h2 className="mt-2 text-sm font-medium">{p.name}</h2>
            <p className="text-sm">{brl(p.priceCents)}</p>
          </a>
        ))}
      </div>
    </main>
  );
}   