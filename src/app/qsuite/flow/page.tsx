export default function FlowPage() {
  return (
    <main className="min-h-svh px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">QuSuite: Complete Step-by-Step Project Documentation</h1>
        <p className="mt-3 text-muted-foreground">
          Fully describe the ISRO-style secure email/messaging system, from Front End to Rust Crypto Engine, KM Manager, and Audit Logger — security levels, file locations, and interconnections.
        </p>

        {/* 1. Overall Architecture */}
        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-medium">1️⃣ Overall Architecture (High-Level)</h2>
          <pre className="rounded-md bg-muted p-4 text-xs leading-relaxed overflow-x-auto">
{` ┌──────────────┐          ┌─────────────┐          ┌───────────────┐
 │ Front End UI │ <─────►  │ QuLayer Or- │ <─────►  │ KM Emulator / │
 │ (Electron)   │  HTTPS   │ chestrator  │  gRPC    │ KM Manager    │
 └──────────────┘          └─────▲───────┘          └──────▲────────┘
                                 │ gRPC                          │ gRPC
                                 ▼                              ▼
                           ┌───────────────┐            ┌──────────────┐
                           │ Crypto Engine │ <────────► │ Audit Logger │
                           │ (Rust)        │            │ (Rust)       │
                           └───────────────┘            └──────────────┘`}
          </pre>
          <div className="text-sm text-muted-foreground">
            <p><span className="font-medium text-green-600">Green</span> = Low Security (Front End)</p>
            <p><span className="font-medium text-sky-600">Blue</span> = Medium Security (Python services)</p>
            <p><span className="font-medium text-red-600">Red</span> = High Security (Rust services)</p>
          </div>
        </section>

        {/* 2. Components */}
        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-medium">2️⃣ Components, Security Levels, Roles & File Locations</h2>
          <ul className="list-disc pl-6 text-sm sm:text-base space-y-2">
            <li>
              <span className="font-medium">Front End UI</span> — JS / Electron / React — <span className="text-green-600">Low</span>
              <div className="text-muted-foreground">Collects user credentials, displays results/telemetry, sends requests to QuLayer. Files: <code>frontend/</code> (<code>main.js</code>, <code>renderer/</code>)</div>
            </li>
            <li>
              <span className="font-medium">QuLayer Orchestrator</span> — Python / FastAPI — <span className="text-sky-600">Medium</span>
              <div className="text-muted-foreground">Orchestrates flow, talks to KM & Crypto, manages sessions and ephemeral tokens. Files: <code>backend/qulayer/</code> (<code>app.py</code>, <code>grpc_clients.py</code>, <code>certs/</code>)</div>
            </li>
            <li>
              <span className="font-medium">KM Emulator / Manager</span> — Python / gRPC — <span className="text-sky-600">Medium</span>
              <div className="text-muted-foreground">Simulates QKD; reserve/commit/destroy; ephemeral in-memory keys. Files: <code>backend/km_emulator/</code> (<code>server.py</code>, <code>memory_store.py</code>, <code>certs/</code>)</div>
            </li>
            <li>
              <span className="font-medium">Crypto Engine</span> — Rust / Tonic gRPC — <span className="text-red-600">High</span>
              <div className="text-muted-foreground">AES-GCM, Kyber, Dilithium, HKDF, OTP; zeroization. Files: <code>services/crypto_engine/</code> (<code>src/main.rs</code>, <code>src/crypto/</code>, <code>Cargo.toml</code>, <code>build.rs</code>, <code>certs/</code>)</div>
            </li>
            <li>
              <span className="font-medium">Audit Logger</span> — Rust / gRPC — <span className="text-red-600">High</span>
              <div className="text-muted-foreground">Append-only, chained hash + Dilithium signatures. Files: <code>services/audit_logger/</code> (<code>src/main.rs</code>, <code>src/log/append_only.rs</code>)</div>
            </li>
            <li>
              <span className="font-medium">Docker Compose</span> — YAML — N/A
              <div className="text-muted-foreground">Orchestrates containers, networking, and cert mounts. File: <code>docker-compose.yml</code></div>
            </li>
          </ul>
        </section>

        {/* 3. Network & Security Boundaries */}
        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-medium">3️⃣ Network & Security Boundaries</h2>
          <ul className="list-disc pl-6 text-sm sm:text-base space-y-2">
            <li>Front End → QuLayer: <span className="font-medium">HTTPS / mTLS</span> — self-signed in dev, PKI in prod. Ephemeral tokens.</li>
            <li>QuLayer ↔ KM Emulator: <span className="font-medium">gRPC / TLS</span> — reserve/commit/destroy; ephemeral handles only.</li>
            <li>QuLayer ↔ Crypto Engine: <span className="font-medium">gRPC / TLS</span> — Encrypt, Decrypt, DeriveSessionKey; raw keys in Rust memory only.</li>
            <li>QuLayer ↔ Audit Logger: <span className="font-medium">gRPC / TLS</span> — LogEvent; chained hashes + PQC signatures.</li>
            <li>Keys at rest: <span className="font-medium">None</span> (except test vectors); immediate zeroization.</li>
            <li>Audit Logs: Rust append-only; Dilithium for non-repudiation.</li>
          </ul>
        </section>

        {/* 4. Detailed Step-by-Step User Flow */}
        <section className="mt-10">
          <h2 className="text-xl font-medium">4️⃣ Detailed Step-by-Step User Flow</h2>
          <ol className="mt-4 space-y-6 list-decimal pl-5">
            <li>
              <h3 className="font-medium">Login</h3>
              <p className="text-sm text-muted-foreground">Front End → QuLayer over HTTPS/mTLS; QuLayer forwards to KM Emulator; KM returns ephemeral session token; QuLayer returns token to Front End. Security: TLS, ephemeral token, minimal PII.</p>
            </li>
            <li>
              <h3 className="font-medium">Reserve Key</h3>
              <p className="text-sm text-muted-foreground">QuLayer → KM Emulator: ReserveKey. Returns <code>QK_ID</code> (handle) — raw key never leaves KM.</p>
            </li>
            <li>
              <h3 className="font-medium">Fetch &amp; Derive Key (Crypto Engine)</h3>
              <p className="text-sm text-muted-foreground">QuLayer → Crypto Engine: DeriveSessionKey(QK_ID). Crypto Engine fetches raw ephemeral key securely from KM; derives ETK via HKDF/PQC; zeroizes raw key.</p>
            </li>
            <li>
              <h3 className="font-medium">Encrypt / Decrypt</h3>
              <p className="text-sm text-muted-foreground">Front End requests QuLayer to encrypt/decrypt. QuLayer calls Crypto Engine. Returns ciphertext/plaintext + signature + QK_ID. Python never sees raw keys.</p>
            </li>
            <li>
              <h3 className="font-medium">Commit / Destroy Key</h3>
              <p className="text-sm text-muted-foreground">QuLayer → KM: CommitKey/DestroyKey. KM zeroizes key; Crypto Engine zeroizes session key; Audit Logger records signed, chained event.</p>
            </li>
            <li>
              <h3 className="font-medium">Logout</h3>
              <p className="text-sm text-muted-foreground">Front End → QuLayer: Logout. QuLayer closes KM session; purges tokens/keys; Audit Logger records termination.</p>
            </li>
          </ol>
        </section>

        {/* 5. P2P Flow */}
        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-medium">5️⃣ P2P Communication Flow (Chat / Call)</h2>
          <ul className="list-disc pl-6 text-sm sm:text-base space-y-2">
            <li>Reserve <span className="font-medium">QK_Control</span> and <span className="font-medium">QK_Master</span> from KM.</li>
            <li>Kyber KEM over QK_Control-secured channel → PQC shared secret.</li>
            <li>Derive session key: <code>ETK_0 = HKDF(QK_Master ⊕ PQC_Secret ⊕ Counter_0)</code>.</li>
            <li>Encrypt media (AES-GCM / SRTP) using <code>ETK_i</code>. Rotate keys by time/data → compute <code>ETK_i+1</code> seamlessly.</li>
            <li>Teardown → commit/destroy keys; log in Audit Logger.</li>
          </ul>
        </section>

        {/* 6. Implementation Layers & Files */}
        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-medium">6️⃣ Implementation Layers &amp; Files</h2>
          <div className="space-y-3 text-sm sm:text-base">
            <div>
              <h3 className="font-medium">6.1 Front End</h3>
              <p className="text-muted-foreground">Folder: <code>frontend/</code> — Files: <code>main.js</code> (Electron bootstrap), <code>renderer/</code> (UI), <code>https_client.js</code> (mTLS). Security: Low; TLS only.</p>
            </div>
            <div>
              <h3 className="font-medium">6.2 QuLayer Orchestrator</h3>
              <p className="text-muted-foreground">Folder: <code>backend/qulayer/</code> — Files: <code>app.py</code> (FastAPI), <code>grpc_clients.py</code>, <code>certs/</code>. Security: Medium; ephemeral tokens, no raw keys.</p>
            </div>
            <div>
              <h3 className="font-medium">6.3 KM Emulator</h3>
              <p className="text-muted-foreground">Folder: <code>backend/km_emulator/</code> — Files: <code>server.py</code> (gRPC), <code>memory_store.py</code> (ephemeral store), <code>certs/</code>. Security: Medium; no persistence.</p>
            </div>
            <div>
              <h3 className="font-medium">6.4 Crypto Engine</h3>
              <p className="text-muted-foreground">Folder: <code>services/crypto_engine/</code> — Files: <code>src/main.rs</code> (gRPC), <code>src/crypto/</code> (AES-GCM, Kyber, Dilithium, HKDF), <code>Cargo.toml</code>, <code>build.rs</code>, <code>certs/</code>. Security: High; PQC, zeroization, enclavable.</p>
            </div>
            <div>
              <h3 className="font-medium">6.5 Audit Logger</h3>
              <p className="text-muted-foreground">Folder: <code>services/audit_logger/</code> — Files: <code>src/main.rs</code>, <code>src/log/append_only.rs</code>. Security: High; tamper-evident PQC logs.</p>
            </div>
          </div>
        </section>

        {/* 7. Docker Compose */}
        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-medium">7️⃣ Docker Compose Setup</h2>
          <ul className="list-disc pl-6 text-sm sm:text-base space-y-2">
            <li>Services: <code>frontend</code>, <code>qulayer</code>, <code>km_emulator</code>, <code>crypto_engine</code>, <code>audit_logger</code></li>
            <li>Mount TLS certificates into each container; use internal Docker network for gRPC/TLS.</li>
            <li>Expose Front End via HTTPS to host.</li>
          </ul>
        </section>

        {/* 8. Security Level Mapping */}
        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-medium">8️⃣ Security Level Mapping</h2>
          <ul className="list-disc pl-6 text-sm sm:text-base space-y-2">
            <li><span className="font-medium text-green-600">Low (UI):</span> HTTPS only, ephemeral session tokens.</li>
            <li><span className="font-medium text-sky-600">Medium (Python):</span> mTLS, ephemeral tokens, ephemeral keys.</li>
            <li><span className="font-medium text-red-600">High (Rust):</span> PQ crypto, zeroization, enclavable, tamper-evident logging.</li>
          </ul>
        </section>

        {/* 9. Next Steps */}
        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-medium">9️⃣ Next Steps / Operationalization</h2>
          <ul className="list-disc pl-6 text-sm sm:text-base space-y-2">
            <li>Write unit &amp; integration tests (<code>pytest</code>, <code>cargo test</code>).</li>
            <li>Deploy via Docker Compose → verify end-to-end flows.</li>
            <li>Set up CI/CD with secret scanning &amp; SAST.</li>
            <li>Integrate TEE/HSM for production root of trust (optional).</li>
            <li>Expand Front End UI → audit logs, session lifecycle, QK metrics.</li>
          </ul>
        </section>

        {/* Summary Map */}
        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-medium">✅ Summary Map of Components and Connections</h2>
          <ul className="list-disc pl-6 text-sm sm:text-base space-y-2">
            <li>Front End — JS/Electron — Low — HTTPS/mTLS → QuLayer</li>
            <li>QuLayer — Python — Medium — gRPC/TLS ↔ KM Emulator + Crypto Engine + Audit Logger</li>
            <li>KM Emulator — Python — Medium — gRPC/TLS ← QuLayer</li>
            <li>Crypto Engine — Rust — High — gRPC/TLS ← QuLayer, gRPC/TLS → KM Emulator</li>
            <li>Audit Logger — Rust — High — gRPC/TLS ← QuLayer</li>
          </ul>
        </section>

        {/* Ultimate AI Prompt */}
        <section className="mt-10">
          <h2 className="text-xl font-medium">Ultimate AI Prompt: QuSuite Architecture Diagram</h2>
          <p className="mt-2 text-sm text-muted-foreground">Copy the prompt below into your diagramming AI tool to generate a professional system architecture diagram.</p>
          <pre className="mt-4 rounded-md bg-muted p-4 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`Generate a professional, technical system architecture diagram for the secure microservice-based platform called QuSuite.
Include every component from front end to backend, all flows, security levels, and folder/file locations, based on the final project specifications.
Layout should be top-down and left-to-right.

Components & Security Levels (Color-coded)
- Front End UI (Electron / JS / HTML / CSS)
  Folder/File: frontend/ — Security: Low (Green)
  Role: Login, input/output, telemetry, initiate encryption/decryption
  Comm: HTTPS/mTLS → QuLayer
- QuLayer Orchestrator (Python)
  Folder/File: backend/qulayer/ — Security: Medium (Blue)
  Role: Business logic, orchestration, adaptive security
  Comm: gRPC/TLS → Crypto Engine, gRPC/TLS → KM Emulator (ephemeral tokens/handles only)
- KM Emulator / Manager (Python)
  Folder/File: backend/km_emulator/ — Security: Medium (Blue)
  Role: Reserve/commit/destroy keys; QKD simulation; in-memory store
  Comm: gRPC/TLS ↔ QuLayer
- Crypto Engine (Rust)
  Folder/File: services/crypto_engine/ — Security: High (Red)
  Role: AES-GCM, Kyber, Dilithium, HKDF, OTP; zeroization; enclavable; gRPC
  Comm: gRPC/TLS ↔ QuLayer
- Audit Logger (Rust)
  Folder/File: services/audit_logger/ — Security: High (Red)
  Role: Tamper-evident append-only log; chained hash + Dilithium signatures
  Comm: gRPC/TLS ↔ QuLayer (logging)

User Flow (Numbered on arrows)
1) Login: Front End → QuLayer (HTTPS/mTLS); QuLayer → KM (session start → ephemeral token)
2) Reserve Key: Front End triggers; QuLayer → KM ReserveKey (returns QK_ID handle)
3) Derive Key: QuLayer → Crypto Engine DeriveSessionKey(QK_ID); Crypto ↔ KM for raw key; HKDF/PQC derivation; zeroize
4) Encrypt/Decrypt: Front End → QuLayer → Crypto Engine; returns ciphertext/plaintext
5) Commit/Destroy: QuLayer → KM CommitKey/DestroyKey; Crypto zeroizes; Audit Logger logs signed event
6) Logout: Front End → QuLayer; QuLayer → KM close session; purge tokens/keys; Audit Logger termination entry

Connections / Channels
- Front End ↔ QuLayer: HTTPS/mTLS (Green)
- QuLayer ↔ KM Emulator: gRPC/TLS (Blue)
- QuLayer ↔ Crypto Engine: gRPC/TLS (Red)
- QuLayer ↔ Audit Logger: gRPC/TLS (Red)
Label arrows with protocol + security; add lock/key/audit icons; mark "Ephemeral / Zeroization" where applicable.

Layout
Top-left: Front End UI
Middle: QuLayer Orchestrator
Right-middle: KM Emulator / Manager
Bottom-right: Crypto Engine (Rust)
Bottom-left: Audit Logger (Rust)

Style & Notes
- Clean ISRO-grade technical style; labeled arrows; color legend (Green/Blue/Red)
- Emphasize ephemeral keys, zeroization, PQC signing, secure transport`}
          </pre>
        </section>
      </div>
    </main>
  );
}