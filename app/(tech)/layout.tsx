"use client";

import { useState, useEffect } from "react";
import { LogOut, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const CACHE_KEY = "tech-profile";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CachedProfile {
  data: { name: string };
  timestamp: number;
}

function getCachedProfile(): string | null {
  if (typeof window === "undefined") return null;
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  try {
    const parsed: CachedProfile = JSON.parse(cached);
    if (Date.now() - parsed.timestamp > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed.data?.name || null;
  } catch {
    sessionStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function setCachedProfile(name: string) {
  sessionStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ data: { name }, timestamp: Date.now() })
  );
}

export default function TechLayout({ children }: { children: React.ReactNode }) {
  const [techName, setTechName] = useState("");

  useEffect(() => {
    const cached = getCachedProfile();
    if (cached) {
      setTechName(cached);
      return;
    }

    async function loadProfile() {
      try {
        const res = await fetch("/api/tech/profile");
        if (!res.ok) return;
        const json = await res.json();
        const name = json.data?.name || "";
        setTechName(name);
        if (name) setCachedProfile(name);
      } catch {}
    }
    loadProfile();
  }, []);

  const handleLogout = async () => {
    sessionStorage.removeItem(CACHE_KEY);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-sm">
              {techName || "Tech Portal"}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-4">{children}</main>
    </div>
  );
}
