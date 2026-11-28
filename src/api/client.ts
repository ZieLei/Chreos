export const API_URL = "http://localhost:8000/api";

const SESSION_KEY = "chreos-session";

export interface Session {
  token: string;
  expiresAt: number;
}

export const getSession = (): Session | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const session: Session = JSON.parse(raw);
    if (session.expiresAt <= Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
};

export const saveSession = (session: Session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage blocked, nothing to clear
  }
};

// fetch() for the Chreos API: sends the session token, and when the server
// says it's no longer valid (expired, logged out elsewhere) goes back to login
export const apiFetch = async (
  path: string,
  init: RequestInit = {},
): Promise<Response> => {
  const session = getSession();

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init.headers as Record<string, string> | undefined),
      ...(session && { Authorization: `Bearer ${session.token}` }),
    },
  });

  if (response.status === 401 && session) {
    clearSession();
    window.location.replace("/");
  }

  return response;
};
