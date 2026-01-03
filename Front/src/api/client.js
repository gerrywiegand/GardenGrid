import { getToken } from "../auth/auth";
// A helper function to make API requests with proper headers and error handling
async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  // Spread options.headers last to allow overriding (e.g., Authorization: undefined for login)
  Object.assign(headers, options.headers || {});

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

// API functions for beds

export function getBeds() {
  return request("/api/beds");
}

export function createBed(payload) {
  return request("/api/beds", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateBed(id, payload) {
  return request(`/api/bed/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteBed(id) {
  return request(`/api/bed/${id}`, {
    method: "DELETE",
  });
}
// API functions for placements
export function getPlacements(bedId) {
  return request(`/api/bed/${bedId}/placements`);
}

export function createPlacement(bedId, payload) {
  return request(`/api/bed/${bedId}/placements`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deletePlacement(id) {
  return request(`/api/placement/${id}`, {
    method: "DELETE",
  });
}

export function updatePlacement(id, payload) {
  return request(`/api/placement/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
