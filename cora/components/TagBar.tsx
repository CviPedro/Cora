import Link from "next/link";

const tags = [
  { label: "Natalino", slug: "natalino" },
  { label: "Escritório", slug: "escritorio" },
  { label: "Cozinha", slug: "cozinha" },
  { label: "Decoração", slug: "decoracao" },
  { label: "Presentes", slug: "presentes" },
];

export default function TagBar() {
  return (
    <nav aria-label="Categorias" className="border-b border-cacau/10 bg-linho">
      <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto whitespace-nowrap px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tags.map((t, i) => (
          <li key={t.slug}>
            <Link
              href={`/loja?tag=${t.slug}`}
              className={
                i === 0
                  ? "block rounded-full border border-vinho/30 px-3 py-1 text-sm text-vinho hover:bg-vinho hover:text-linho"
                  : "block rounded-full border border-vinho/30 px-3 py-1 text-sm text-vinho hover:bg-vinho hover:text-linho"
              }
            >
              {t.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}