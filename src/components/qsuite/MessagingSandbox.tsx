"use client";

import { useMemo, useState } from "react";

async function deriveKey(passphrase: string, salt: Uint8Array, iterations: number) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptMessage(message: string, passphrase: string, iterations: number) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(passphrase, salt, iterations);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(message)
  );
  // package: salt + iv + data (base64)
  const pack = new Uint8Array(salt.length + iv.length + new Uint8Array(ciphertext).length);
  pack.set(salt, 0);
  pack.set(iv, salt.length);
  pack.set(new Uint8Array(ciphertext), salt.length + iv.length);
  return btoa(String.fromCharCode(...pack));
}

async function decryptMessage(payloadB64: string, passphrase: string, iterations: number) {
  const pack = Uint8Array.from(atob(payloadB64), (c) => c.charCodeAt(0));
  const salt = pack.slice(0, 16);
  const iv = pack.slice(16, 28);
  const data = pack.slice(28);
  const key = await deriveKey(passphrase, salt, iterations);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  return new TextDecoder().decode(plaintext);
}

export const MessagingSandbox = () => {
  const [passphrase, setPassphrase] = useState("");
  const [message, setMessage] = useState("");
  const [cipher, setCipher] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [level, setLevel] = useState<"L1" | "L2" | "L3" | "L4">("L1");

  const iterations = useMemo(() => {
    // Simulate increasing security levels with stronger KDF work factor
    switch (level) {
      case "L2":
        return 200_000;
      case "L3":
        return 400_000;
      case "L4":
        return 800_000;
      case "L1":
      default:
        return 100_000;
    }
  }, [level]);

  const disabled = useMemo(() => !passphrase, [passphrase]);

  const addLog = (s: string) => setLog((prev) => [
    `${new Date().toLocaleTimeString()} — ${s}`,
    ...prev,
  ]);

  const handleEncrypt = async () => {
    try {
      const ct = await encryptMessage(message, passphrase, iterations);
      setCipher(ct);
      addLog(`Encrypted message using AES-GCM (level ${level}, PBKDF2 iters=${iterations.toLocaleString()})`);
    } catch (e) {
      addLog(`Encrypt error: ${(e as Error).message}`);
    }
  };

  const handleDecrypt = async () => {
    try {
      const pt = await decryptMessage(cipher, passphrase, iterations);
      setMessage(pt);
      addLog(`Decrypted message (level ${level})`);
    } catch (e) {
      addLog(`Decrypt error: ${(e as Error).message}`);
    }
  };

  const handleClear = () => {
    setMessage("");
    setCipher("");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Passphrase</label>
            <input
              type="password"
              autoComplete="off"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter secret passphrase"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Security level</label>
            <select
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
            >
              <option value="L1">L1 — Basic (100k iters)</option>
              <option value="L2">L2 — Enhanced (200k iters)</option>
              <option value="L3">L3 — Strong (400k iters)</option>
              <option value="L4">L4 — Highest (800k iters)</option>
            </select>
            <p className="mt-1 text-xs text-muted-foreground">Levels simulate adaptive security (L1→L4) by increasing KDF work factor. In QuSuite, levels map to HKDF/PQC/AES profiles in the Rust Crypto Engine.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Plaintext</label>
          <textarea
            className="mt-1 h-36 w-full rounded-md border bg-background p-3 text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message to encrypt"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleEncrypt}
            disabled={disabled}
            className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            Encrypt
          </button>
          <button
            onClick={handleDecrypt}
            disabled={disabled || !cipher}
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Decrypt
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"
          >
            Clear
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium">Ciphertext (base64)</label>
          <textarea
            className="mt-1 h-36 w-full rounded-md border bg-background p-3 text-xs font-mono"
            value={cipher}
            onChange={(e) => setCipher(e.target.value)}
            placeholder="Appears after encryption; paste here to decrypt"
          />
        </div>
      </section>

      <aside className="space-y-3">
        <h3 className="text-sm font-medium">Audit Log (demo)</h3>
        <div className="h-80 overflow-auto rounded-md border bg-background p-3 text-xs">
          {log.length === 0 ? (
            <p className="text-muted-foreground">No events yet.</p>
          ) : (
            <ul className="space-y-2">
              {log.map((l, i) => (
                <li key={i} className="font-mono">{l}</li>
              ))}
            </ul>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          This client-side sandbox uses WebCrypto for demonstration only. In QuSuite, all encryption happens in the Rust Crypto Engine via gRPC/TLS.
        </p>
      </aside>
    </div>
  );
};

export default MessagingSandbox;