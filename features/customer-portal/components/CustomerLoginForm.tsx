"use client";

import { Mail, ArrowRight, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomerLogin } from "../hooks/useCustomerLogin";

export function CustomerLoginForm() {
  const {
    mode, email, password, status, errorMsg,
    setEmail, setPassword, switchMode,
    handleMagicLink, handlePassword, resetForm,
  } = useCustomerLogin();

  if (status === "sent") {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 text-center space-y-4">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <div>
            <h2 className="text-lg font-semibold">Check your email</h2>
            <p className="text-sm text-muted-foreground mt-1">
              We sent a login link to <strong>{email}</strong>
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={resetForm}>
            Use a different email
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">Customer Portal</CardTitle>
        <p className="text-sm text-muted-foreground">Sign in to access your portal</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex rounded-lg border p-0.5">
          <button
            type="button"
            onClick={() => switchMode("magic-link")}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              mode === "magic-link"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Magic Link
          </button>
          <button
            type="button"
            onClick={() => switchMode("password")}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              mode === "password"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Password
          </button>
        </div>

        <form
          onSubmit={mode === "magic-link" ? handleMagicLink : handlePassword}
          className="space-y-3"
        >
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
              required
              disabled={status === "sending"}
            />
          </div>
          {mode === "password" && (
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
                disabled={status === "sending"}
              />
            </div>
          )}
          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
          <Button type="submit" className="w-full" disabled={status === "sending" || !email.trim()}>
            {status === "sending" ? "Signing in..." : mode === "magic-link" ? (
              <>Send Magic Link <ArrowRight className="ml-2 h-4 w-4" /></>
            ) : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
