"use client";

import { useCallback } from "react";
import { useAuth } from "../context";

/**
 * Hook para hacer fetch autenticado a las APIs.
 * Agrega automáticamente el header Authorization con el access token.
 */
export function useAuthFetch() {
  const { accessToken, refreshAuth } = useAuth();

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers);
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      headers.set("Content-Type", "application/json");

      let res = await fetch(url, { ...options, headers });

      // Si el token expiró, intentar refresh y reintentar
      if (res.status === 401) {
        await refreshAuth();
        // Reintentar con el nuevo token
        if (accessToken) {
          headers.set("Authorization", `Bearer ${accessToken}`);
          res = await fetch(url, { ...options, headers });
        }
      }

      return res;
    },
    [accessToken, refreshAuth]
  );

  return authFetch;
}
