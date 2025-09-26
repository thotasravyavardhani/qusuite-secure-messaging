import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-svh px-6 py-16 sm:px-10">
      <section className="mx-auto max-w-5xl text-center sm:text-left">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">QuSuite</h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Secure messaging architecture and docs: Frontend → Orchestrator → KM → Crypto Engine → Audit Logger.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/qsuite/architecture"
            className="group rounded-lg border p-5 transition-colors hover:bg-accent"
          >
            <h2 className="text-lg font-medium">Architecture Overview →</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Components, security levels, connections, and file locations.
            </p>
          </Link>

          <Link
            href="/qsuite/flow"
            className="group rounded-lg border p-5 transition-colors hover:bg-accent"
          >
            <h2 className="text-lg font-medium">System Flow →</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              6-step workflow: Login → Reserve → Derive → Encrypt/Decrypt → Commit/Destroy → Logout.
            </p>
          </Link>

          <Link
            href="/qsuite/messaging"
            className="group rounded-lg border p-5 transition-colors hover:bg-accent"
          >
            <h2 className="text-lg font-medium">Messaging Sandbox →</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try the secure messaging UI and explore the UX.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}