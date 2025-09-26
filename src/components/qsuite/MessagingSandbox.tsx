"use client";

import { useMemo, useState } from "react";

async function deriveKey(passphrase: string, salt: Uint8Array) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptMessage(message: string, passphrase: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(passphrase, salt);
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

async function decryptMessage(payloadB64: string, passphrase: string) {
  const pack = Uint8Array.from(atob(payloadB64), (c) => c.charCodeAt(0));
  const salt = pack.slice(0, 16);
  const iv = pack.slice(16, 28);
  const data = pack.slice(28);
  const key = await deriveKey(passphrase, salt);
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
  const disabled = useMemo(() => !passphrase, [passphrase]);

  const addLog = (s: string) => setLog((prev) => [
    `${new Date().toLocaleTimeString()} — ${s}`,
    ...prev,
  ]);

  const handleEncrypt = async () => {
    try {
      const ct = await encryptMessage(message, passphrase);
      setCipher(ct);
      addLog("Encrypted message using AES-GCM (browser WebCrypto)");
    } catch (e) {
      addLog(`Encrypt error: ${(e as Error).message}`);
    }
  };

  const handleDecrypt = async () => {
    try {
      const pt = await decryptMessage(cipher, passphrase);
      setMessage(pt);
      addLog("Decrypted message");
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