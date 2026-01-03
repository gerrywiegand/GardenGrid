import { getToken } from "../auth/auth";

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export function login({ username, password }) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: { Authorization: undefined }, // ensure no stale token
  });
}

export function signup({ username, password }) {
  return request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function getPlants() {
  return request("/api/plants");
}
