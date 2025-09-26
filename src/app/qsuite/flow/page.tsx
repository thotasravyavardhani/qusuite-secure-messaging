export default function FlowPage() {
  return (
    <main className="min-h-svh px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">QuSuite System Flow</h1>
        <p className="mt-3 text-muted-foreground">
          End-to-end workflow across services with security guarantees at each step.
        </p>

        <ol className="mt-8 space-y-6 list-decimal pl-5">
          <li>
            <h3 className="font-medium">Login</h3>
            <p className="text-sm text-muted-foreground">Front End → QuLayer over HTTPS/mTLS; QuLayer starts a session with KM Emulator and returns an ephemeral token.</p>
          </li>
          <li>
            <h3 className="font-medium">Reserve Key</h3>
            <p className="text-sm text-muted-foreground">QuLayer → KM Emulator gRPC/TLS: ReserveKey. Returns a key handle (QK_ID). Raw key never leaves KM.</p>
          </li>
          <li>
            <h3 className="font-medium">Derive Session Key</h3>
            <p className="text-sm text-muted-foreground">QuLayer → Crypto Engine gRPC/TLS: DeriveSessionKey(QK_ID). Crypto Engine fetches raw key from KM securely and derives ETK via HKDF/PQC.</p>
          </li>
          <li>
            <h3 className="font-medium">Encrypt / Decrypt</h3>
            <p className="text-sm text-muted-foreground">Front End requests QuLayer to encrypt/decrypt. QuLayer calls Crypto Engine. Python never sees raw keys.</p>
          </li>
          <li>
            <h3 className="font-medium">Commit / Destroy</h3>
            <p className="text-sm text-muted-foreground">QuLayer instructs KM to commit/destroy QK_ID. Both KM and Crypto Engine zeroize memory. Audit Logger records a signed event.</p>
          </li>
          <li>
            <h3 className="font-medium">Logout</h3>
            <p className="text-sm text-muted-foreground">Front End logs out. QuLayer closes session in KM. Tokens and keys are purged. Audit Logger records termination.</p>
          </li>
        </ol>
      </div>
    </main>
  );
}