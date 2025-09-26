export default function ArchitecturePage() {
  return (
    <main className="min-h-svh px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">QuSuite Architecture</h1>
        <p className="mt-3 text-muted-foreground">
          High-level overview of all components, security levels, connections, and file locations.
        </p>
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-medium">Components</h2>
          <ul className="list-disc pl-6 text-sm sm:text-base">
            <li>Front End UI (Electron/React) — Low Security</li>
            <li>QuLayer Orchestrator (Python/FastAPI) — Medium Security</li>
            <li>KM Emulator / Manager (Python/gRPC) — Medium Security</li>
            <li>Crypto Engine (Rust/Tonic) — High Security</li>
            <li>Audit Logger (Rust) — High Security</li>
          </ul>
        </section>
      </div>
    </main>
  );
}