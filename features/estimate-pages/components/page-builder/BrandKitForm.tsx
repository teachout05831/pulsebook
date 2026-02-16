"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Loader2, Palette, Shield, Share2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { BrandKitInput, BrandTone, SocialLinks } from "../../types";
import { BrandMediaTab } from "./BrandMediaTab";

const DEFAULT_FORM: BrandKitInput = {
  logoUrl: null, primaryColor: "#2563eb", secondaryColor: "#1e40af",
  accentColor: "#f59e0b", fontFamily: "Inter", headingFont: null,
  tagline: null, companyDescription: null, tone: "friendly",
  googleReviewsUrl: null, googleRating: null, googleReviewCount: null,
  certifications: [], insuranceInfo: null, socialLinks: {},
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

export function BrandKitForm() {
  const [form, setForm] = useState<BrandKitInput>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/brand-kit")
      .then((r) => { if (!r.ok) throw new Error("Failed to load"); return r.json(); })
      .then(({ data }) => { if (data) setForm(data); })
      .catch(() => toast.error("Failed to load brand kit"))
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof BrandKitInput, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const setSocial = (key: keyof SocialLinks, value: string) =>
    setForm((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value || undefined } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/brand-kit", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      toast.success("Brand kit saved");
    } catch { toast.error("Failed to save brand kit"); } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-64 w-full" /></div>
  );

  const social = (form.socialLinks ?? {}) as SocialLinks;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Brand Kit</h2>
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>
      <Tabs defaultValue="brand">
        <TabsList>
          <TabsTrigger value="brand"><Palette className="mr-1.5 h-3.5 w-3.5" />Brand</TabsTrigger>
          <TabsTrigger value="media"><ImageIcon className="mr-1.5 h-3.5 w-3.5" />Media</TabsTrigger>
          <TabsTrigger value="trust"><Shield className="mr-1.5 h-3.5 w-3.5" />Trust</TabsTrigger>
          <TabsTrigger value="social"><Share2 className="mr-1.5 h-3.5 w-3.5" />Social</TabsTrigger>
        </TabsList>
        <TabsContent value="brand">
          <Card>
            <CardHeader><CardTitle>Brand Identity</CardTitle><CardDescription>Colors, fonts, and messaging</CardDescription></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Font Family"><Input value={form.fontFamily ?? "Inter"} onChange={(e) => set("fontFamily", e.target.value)} /></Field>
              <Field label="Primary Color"><Input type="color" value={form.primaryColor ?? "#2563eb"} onChange={(e) => set("primaryColor", e.target.value)} /></Field>
              <Field label="Secondary Color"><Input type="color" value={form.secondaryColor ?? "#1e40af"} onChange={(e) => set("secondaryColor", e.target.value)} /></Field>
              <Field label="Accent Color"><Input type="color" value={form.accentColor ?? "#f59e0b"} onChange={(e) => set("accentColor", e.target.value)} /></Field>
              <Field label="Heading Font"><Input value={form.headingFont ?? ""} onChange={(e) => set("headingFont", e.target.value || null)} placeholder="Optional heading font" /></Field>
              <div className="sm:col-span-2"><Field label="Tagline"><Input value={form.tagline ?? ""} onChange={(e) => set("tagline", e.target.value || null)} placeholder="Your company tagline" /></Field></div>
              <div className="sm:col-span-2"><Field label="Company Description"><Textarea value={form.companyDescription ?? ""} onChange={(e) => set("companyDescription", e.target.value || null)} rows={3} placeholder="Brief description of your company" /></Field></div>
              <Field label="Tone">
                <Select value={form.tone ?? "friendly"} onValueChange={(v) => set("tone", v as BrandTone)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem><SelectItem value="friendly">Friendly</SelectItem><SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="media"><BrandMediaTab form={form} set={set} /></TabsContent>
        <TabsContent value="trust">
          <Card>
            <CardHeader><CardTitle>Trust Signals</CardTitle><CardDescription>Reviews, certifications, and insurance</CardDescription></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Field label="Google Reviews URL"><Input value={form.googleReviewsUrl ?? ""} onChange={(e) => set("googleReviewsUrl", e.target.value || null)} placeholder="https://g.page/..." /></Field></div>
              <Field label="Google Rating"><Input type="number" min={0} max={5} step={0.1} value={form.googleRating ?? ""} onChange={(e) => set("googleRating", e.target.value ? Number(e.target.value) : null)} /></Field>
              <Field label="Google Review Count"><Input type="number" min={0} value={form.googleReviewCount ?? ""} onChange={(e) => set("googleReviewCount", e.target.value ? Number(e.target.value) : null)} /></Field>
              <div className="sm:col-span-2"><Field label="Certifications (comma-separated)"><Input value={(form.certifications ?? []).join(", ")} onChange={(e) => set("certifications", e.target.value ? e.target.value.split(",").map((s) => s.trim()).filter(Boolean) : [])} placeholder="EPA Lead-Safe, OSHA 30, Licensed & Bonded" /></Field></div>
              <div className="sm:col-span-2"><Field label="Insurance Info"><Textarea value={form.insuranceInfo ?? ""} onChange={(e) => set("insuranceInfo", e.target.value || null)} rows={2} placeholder="e.g., $2M general liability, fully bonded" /></Field></div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="social">
          <Card>
            <CardHeader><CardTitle>Social Links</CardTitle><CardDescription>Connect your social media profiles</CardDescription></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Facebook"><Input value={social.facebook ?? ""} onChange={(e) => setSocial("facebook", e.target.value)} placeholder="https://facebook.com/..." /></Field>
              <Field label="Instagram"><Input value={social.instagram ?? ""} onChange={(e) => setSocial("instagram", e.target.value)} placeholder="https://instagram.com/..." /></Field>
              <Field label="Twitter / X"><Input value={social.twitter ?? ""} onChange={(e) => setSocial("twitter", e.target.value)} placeholder="https://x.com/..." /></Field>
              <Field label="LinkedIn"><Input value={social.linkedin ?? ""} onChange={(e) => setSocial("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." /></Field>
              <Field label="YouTube"><Input value={social.youtube ?? ""} onChange={(e) => setSocial("youtube", e.target.value)} placeholder="https://youtube.com/..." /></Field>
              <Field label="TikTok"><Input value={social.tiktok ?? ""} onChange={(e) => setSocial("tiktok", e.target.value)} placeholder="https://tiktok.com/@..." /></Field>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
