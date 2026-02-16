"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "magic-link" | "password";
type Status = "idle" | "sending" | "sent" | "error";

export function useCustomerLogin() {
  const [mode, setMode] = useState<Mode>("magic-link");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setErrorMsg("");
    setStatus("idle");
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/customer/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = await res.json();
      if (json.error) { setStatus("error"); setErrorMsg(json.error); }
      else { setStatus("sent"); }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) { setStatus("error"); setErrorMsg("Invalid email or password"); }
      else { window.location.href = "/portal"; }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  const resetForm = () => { setStatus("idle"); setEmail(""); };

  return {
    mode, email, password, status, errorMsg,
    setEmail, setPassword, switchMode,
    handleMagicLink, handlePassword, resetForm,
  };
}
