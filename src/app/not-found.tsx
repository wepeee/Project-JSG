import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-2xl border p-8 text-center">
        <p className="text-muted-foreground text-sm tracking-widest uppercase">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Halaman Tidak Ditemukan</h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Route yang kamu buka tidak ada atau sudah dipindah.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
          >
            Kembali ke Dashboard
          </Link>
          <Link
            href="/login"
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            Ke Login
          </Link>
        </div>
      </div>
    </main>
  );
}
