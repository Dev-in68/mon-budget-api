// src/lib/api.ts
// -------------------- CONFIG API --------------------
const API_URL = import.meta.env.VITE_API_URL as string;
if (!API_URL) {
  throw new Error(
    "VITE_API_URL manquant. Ajoute-le dans .env (ex: VITE_API_URL=http://localhost:3000)",
  );
}

// -------------------- TOKENS (localStorage) --------------------
export type Tokens = { accessToken: string; refreshToken: string };

const ACCESS_KEY = "mb_access";
const REFRESH_KEY = "mb_refresh";

/** Sauvegarde les tokens en localStorage */
export function saveTokens(tokens: Tokens) {
  localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
}

/** Charge les tokens s’ils existent */
export function loadTokens(): Tokens | null {
  const accessToken = localStorage.getItem(ACCESS_KEY);
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

/** Supprime les tokens (utilisé au logout) */
export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// -------------------- HTTP HELPERS --------------------
type Options = {
  token?: string; // access token (Authorization: Bearer)
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
  opts: Options = {},
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers ?? {}),
  };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: opts.signal,
    credentials: "include", // utile si tu as des cookies côté API
  });

  if (!res.ok) {
    // Lis le texte d’erreur si dispo pour faciliter le debug
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} – ${text}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  return (await res.json()) as T;
}

export function getJson<T>(path: string, opts?: Options) {
  return request<T>("GET", path, undefined, opts);
}
export function postJson<T, B = unknown>(
  path: string,
  body: B,
  opts?: Options,
) {
  return request<T>("POST", path, body, opts);
}
export function putJson<T, B = unknown>(path: string, body: B, opts?: Options) {
  return request<T>("PUT", path, body, opts);
}
export function delJson<T>(path: string, opts?: Options) {
  return request<T>("DELETE", path, undefined, opts);
}
