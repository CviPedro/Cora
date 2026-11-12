import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
      <h1 className="text-5xl font-bold text-vinho">404</h1>
      <p className="mt-3">Essa página não existe (ainda).</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-vinho px-5 py-2 text-sm font-semibold text-linho"
      >
        Voltar ao início
      </Link>
    </main>
  );
}