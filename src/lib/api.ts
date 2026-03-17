/**
 * Authenticated fetch wrapper — always sends cookies with every request.
 * Use this instead of raw fetch() for all API calls that need the session.
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

/**
 * Parse JSON response safely — returns a clear error if HTML is returned
 * (which happens when the route 404s or returns an HTML error page).
 */
export async function apiJson<T = unknown>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    console.error("API returned non-JSON:", text.slice(0, 200));
    throw new Error(
      res.status === 404
        ? "API route not found (404)"
        : res.status === 401
        ? "Not logged in — please sign in again"
        : `Server error (${res.status})`
    );
  }
}
