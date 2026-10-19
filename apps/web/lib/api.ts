const FALLBACK_API_URL = "http://localhost:4000/api";

/**
 * The Express app mounts every router under /api, so request paths here are
 * relative ("/goal-plan", "/streak", …). Accept either configured form:
 *   https://api.example.com
 *   https://api.example.com/api
 * and always resolve to a base ending in /api — never doubling the prefix.
 */
export function normalizeApiBaseUrl(value: string) {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) return FALLBACK_API_URL;
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
}

export const API_URL = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_API_URL ?? FALLBACK_API_URL
);

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null; // API offline → pages fall back to clearly-labeled sample data
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
};
