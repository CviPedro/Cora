import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { brl } from "@/lib/format";

async function Lista() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { media: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {products.map((p) => (
        <a key={p.id} href={`/produto/${p.slug}`} className="rounded border p-2">
          {p.media[0] && (
            <img src={p.media[0].url} alt={p.name} className="aspect-square w-full object-cover" />
          )}
          <h2 className="mt-2 text-sm font-medium">{p.name}</h2>
          <p className="text-sm">{brl(p.priceCents)}</p>
        </a>
      ))}
    </div>
  );
}

export default function LojaPage() {
  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Loja</h1>
      <Suspense fallback={<p>Carregando...</p>}>
        <Lista />
      </Suspense>
    </main>
  );
}