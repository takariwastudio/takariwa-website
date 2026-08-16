/**
 * Sesión de admin firmada con HMAC — sin librería de auth externa, porque es
 * un solo usuario/clave compartido (no hay tabla de usuarios). Usa Web Crypto
 * (crypto.subtle) en vez del módulo "crypto" de Node porque este código corre
 * tanto en proxy.ts (Edge runtime) como en server actions (Node runtime), y
 * Web Crypto es la única API disponible en ambos.
 */
const encoder = new TextEncoder();

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string) {
  const bytes = hex.match(/.{1,2}/g) ?? [];
  return new Uint8Array(bytes.map((b) => parseInt(b, 16)));
}

export async function createSessionToken(
  secret: string,
  maxAgeSeconds = 60 * 60 * 24 * 7,
) {
  const payload = JSON.stringify({ exp: Date.now() + maxAgeSeconds * 1000 });
  const payloadB64 = btoa(payload);
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payloadB64),
  );
  return `${payloadB64}.${toHex(signature)}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token) return false;
  const [payloadB64, sigHex] = token.split(".");
  if (!payloadB64 || !sigHex) return false;

  try {
    const key = await getKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromHex(sigHex),
      encoder.encode(payloadB64),
    );
    if (!valid) return false;

    const payload = JSON.parse(atob(payloadB64)) as { exp: number };
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}
