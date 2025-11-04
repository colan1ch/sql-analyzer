// src/modules/IndexesApi.ts
import type { Index } from "./IndexesTypes";

export async function listIndexes(params?: { name?: string; date_from?: string; date_to?: string }): Promise<Index[]> {
  try {
    let path = "/api/v1/indexes";
    if (params) {
      const query = new URLSearchParams();
      if (params.name) query.append("index_name", params.name);
      const queryString = query.toString();
      if (queryString) path += `?${queryString}`;
    }

    const res = await fetch(path, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function getIndex(id: number): Promise<Index | null> {
  try {
    const res = await fetch(`/api/v1/indexes/${id}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}