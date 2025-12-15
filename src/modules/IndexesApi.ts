// src/modules/IndexesApi.ts
import type { Index } from "./IndexesTypes";
import { api } from "../api";


const API_BASE_URL = "https://192.168.0.17:3000";

export async function listIndexes(params?: { name?: string; date_from?: string; date_to?: string }): Promise<Index[]> {
  try {
    let path = "/api/v1/indexes";
    if (params) {
      const query = new URLSearchParams();
      if (params.name) query.append("index_name", params.name);
      const queryString = query.toString();
      if (queryString) path += `?${queryString}`;
    }

    const res = await fetch(`${API_BASE_URL}${path}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function getIndex(id: number): Promise<Index | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/indexes/${id}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function getQueryCart(): Promise<{ id: number; indexes_count: number }> {
  try {
    const response = await api.queries.queryCartList();
    return {
      id: response.data?.id || 0,
      indexes_count: response.data?.indexes_count || 0
    };
  } catch (err) {
    console.error('Error loading query cart:', err);
    return {
      id: -1,
      indexes_count: 0
    };
  }
}