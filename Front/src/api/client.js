import { getToken } from "../auth/auth";
// A helper function to make API requests with proper headers and error handling
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
// API functions for Auth
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
// API functions for Plants

export function getPlants() {
  return request("/api/plants");
}

export function createPlant(payload) {
  return request("/api/plants", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updatePlant(id, payload) {
  return request(`/api/plant/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deletePlant(id) {
  return request(`/api/plant/${id}`, {
    method: "DELETE",
  });
}

// API functions for gardens

export function getGardens() {
  return request("/api/gardens");
}

export function createGarden(payload) {
  return request("/api/gardens", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateGarden(id, payload) {
  return request(`/api/garden/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteGarden(id) {
  return request(`/api/garden/${id}`, {
    method: "DELETE",
  });
}
