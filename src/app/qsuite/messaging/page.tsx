import MessagingSandbox from "@/components/qsuite/MessagingSandbox";

export default function MessagingPage() {
  return (
    <main className="min-h-svh px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Messaging Sandbox</h1>
        <p className="mt-3 text-muted-foreground">
          Try a local-only encryption demo to understand the UX. Real QuSuite routes messages via the Rust Crypto Engine and orchestrator.
        </p>
        <div className="mt-8">
          <MessagingSandbox />
        </div>
      </div>
    </main>
  );
}