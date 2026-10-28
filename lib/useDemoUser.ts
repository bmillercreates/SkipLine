"use client";

import { useCallback, useEffect, useState } from "react";

// There are no real accounts in this demo. Each browser gets a random id
// (stored in localStorage) that owns the passes it buys.
export type DemoUser = { id: string; name: string };

const KEY = "skipline:user";

function load(): DemoUser {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const user = { id: crypto.randomUUID(), name: "" };
  try {
    localStorage.setItem(KEY, JSON.stringify(user));
  } catch {}
  return user;
}

export function useDemoUser() {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => setUser(load()), []);

  const setName = useCallback((name: string) => {
    setUser((u) => {
      if (!u) return u;
      const next = { ...u, name };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { user, setName };
}
