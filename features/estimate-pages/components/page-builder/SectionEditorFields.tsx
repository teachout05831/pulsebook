"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { PageSection } from "../../types";
import { getContent } from "./sectionEditorConfig";
import { FAQListEditor, TestimonialListEditor, TimelineListEditor, PhotoListEditor } from "./SectionListEditor";
import { ContentBlockEditor } from "./ContentBlockEditor";
import { TrustBadgesFields } from "./TrustBadgesFields";
import { ImageUploadField } from "@/features/media/components/ImageUploadField";
import { VideoLibraryPicker } from "@/features/media/components/VideoLibraryPicker";
import { PackagesEditor } from "./PackagesEditor";
import type { PackageItem } from "../TierSelectionContext";
import { CustomHtmlEditor } from "./CustomHtmlEditor";
import { BlockFieldsEditor } from "./BlockFieldsEditor";
import type { CustomHtmlContent } from "../../types";

interface Props {
  section: PageSection;
  onUpdateContent: (key: string, value: unknown) => void;
  onUpdateSettings: (key: string, value: unknown) => void;
  onBatchUpdateContent?: (updates: Record<string, unknown>) => void;
}

function F({ label, ph, value, set }: { label: string; ph: string; value: string; set: (v: string) => void }) {
  return (<div className="space-y-1.5"><Label className="text-xs">{label}</Label>
    <Input className="h-8 text-xs" placeholder={ph} value={value} onChange={(e) => set(e.target.value)} /></div>);
}
function TA({ label, ph, value, set }: { label: string; ph: string; value: string; set: (v: string) => void }) {
  return (<div className="space-y-1.5"><Label className="text-xs">{label}</Label>
    <Textarea className="text-xs min-h-[60px]" placeholder={ph} value={value} onChange={(e) => set(e.target.value)} rows={3} /></div>);
}
function Tog({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (<div className="flex items-center justify-between"><Label className="text-xs">{label}</Label><Switch checked={on} onCheckedChange={set} /></div>);
}

export function SectionEditorFields({ section, onUpdateContent: uc, onUpdateSettings: us, onBatchUpdateContent: ucBatch }: Props) {
  const c = (key: string) => getContent(section, key);
  const s = (k: string) => (v: string) => uc(k, v);

  switch (section.type) {
    case "hero": return (<>
      <F label="Title Override" ph="Company name" value={c("title")} set={s("title")} />
      <F label="Subtitle" ph="Your tagline..." value={c("subtitle")} set={s("subtitle")} />
      <ImageUploadField value={c("heroImageUrl") || null} onChange={(url) => uc("heroImageUrl", url || "")} label="Hero Image" context="estimate-page" />
    </>);
    case "about": return (<>
      <F label="Title" ph="Why Choose Us" value={c("title")} set={s("title")} />
      <TA label="Description" ph="Tell customers about your company..." value={c("description")} set={s("description")} />
      <ImageUploadField value={c("imageUrl") || null} onChange={(url) => uc("imageUrl", url || "")} label="About Image" context="estimate-page" />
      <p className="text-[11px] text-muted-foreground">Stats (rating, certifications) are pulled from Brand Kit automatically.</p>
    </>);
    case "scope": return (<>
      <F label="Title" ph="Scope of Work" value={c("title")} set={s("title")} />
      <TA label="Narrative (narrative variant)" ph="Describe the work..." value={c("narrative")} set={s("narrative")} />
    </>);
    case "pricing":
      return (<>
        <F label="Title" ph="Pricing" value={c("title")} set={s("title")} />
        {(section.settings.variant as string) === "packages" && (
          <PackagesEditor
            packages={(section.content.packages as PackageItem[]) || []}
            onChange={(v) => uc("packages", v)}
          />
        )}
      </>);
    case "project_photos": case "gallery": return (<>
      <F label="Title" ph={section.type === "project_photos" ? "Your Project" : "Our Work"} value={c("title")} set={s("title")} />
      <PhotoListEditor items={(section.content.photos as { url: string; caption?: string }[]) || []} onChange={(v) => uc("photos", v)} />
    </>);
    case "testimonials": return (<>
      <F label="Title" ph="What Our Customers Say" value={c("title")} set={s("title")} />
      <Tog label="Show Google Rating" on={!!section.content.showGoogleRating} set={(v) => uc("showGoogleRating", v)} />
      <TestimonialListEditor items={(section.content.testimonials as { name: string; text: string; rating: number }[]) || []} onChange={(v) => uc("testimonials", v)} />
    </>);
    case "faq": return (<>
      <F label="Title" ph="FAQ" value={c("title")} set={s("title")} />
      <FAQListEditor items={(section.content.items as { question: string; answer: string }[]) || []} onChange={(v) => uc("items", v)} />
    </>);
    case "timeline": return (<>
      <F label="Title" ph="What Happens Next" value={c("title")} set={s("title")} />
      <TimelineListEditor steps={(section.content.steps as { title: string; description: string }[]) || []} onChange={(v) => uc("steps", v)} />
    </>);
    case "video": return (<>
      <F label="Title" ph="Watch Our Video" value={c("title")} set={s("title")} />
      <VideoLibraryPicker
        triggerLabel="Choose from Library"
        onSelect={(video) => {
          uc("videoUrl", video.bunnyCdnUrl);
          if (video.thumbnailUrl) uc("thumbnailUrl", video.thumbnailUrl);
        }}
      />
      <F label="Video URL" ph="https://youtube.com/watch?v=..." value={c("videoUrl")} set={s("videoUrl")} />
      <TA label="Description" ph="About this video..." value={c("description")} set={s("description")} />
    </>);
    case "video_call": return (<>
      <F label="Title" ph="Schedule a Video Call" value={c("title")} set={s("title")} />
      <F label="Description" ph="Let's walk through the project" value={c("description")} set={s("description")} />
    </>);
    case "calendar": return (<>
      <F label="Title" ph="Book a Time" value={c("title")} set={s("title")} />
      <F label="Booking URL" ph="https://calendly.com/..." value={c("bookingUrl")} set={s("bookingUrl")} />
      <F label="Description" ph="Choose a convenient time" value={c("description")} set={s("description")} />
    </>);
    case "approval": return (<>
      <F label="Title" ph="Ready to move forward?" value={c("title")} set={s("title")} />
      <F label="Subtitle" ph="Approve your estimate" value={c("subtitle")} set={s("subtitle")} />
      <Tog label="Show Deposit Info" on={!!section.settings.showDepositInfo} set={(v) => us("showDepositInfo", v)} />
    </>);
    case "payment": return (<>
      <F label="Title" ph="Secure Your Project" value={c("title")} set={s("title")} />
      <F label="Deposit Amount" ph="500" value={String(section.content.depositAmount || "")} set={(v) => uc("depositAmount", v ? Number(v) : undefined)} />
      <div className="space-y-1.5"><Label className="text-xs">Deposit Type</Label>
        <select className="w-full h-8 text-xs border rounded-md px-2 bg-background" value={(section.content.depositType as string) || "flat"} onChange={(e) => uc("depositType", e.target.value)}>
          <option value="flat">Flat Amount ($)</option><option value="percentage">Percentage (%)</option></select></div>
      <Tog label="Accept Full Payment" on={!!section.settings.acceptFullPayment} set={(v) => us("acceptFullPayment", v)} />
    </>);
    case "contact": return (<>
      <F label="Phone" ph="(555) 123-4567" value={c("phone")} set={s("phone")} />
      <F label="Email" ph="contact@company.com" value={c("email")} set={s("email")} />
      <F label="Address" ph="123 Main St, City, ST" value={c("address")} set={s("address")} />
      <TA label="Business Hours" ph="Mon-Fri: 8am-5pm" value={c("hours")} set={s("hours")} />
      <F label="License Number" ph="LIC-12345" value={c("licenseNumber")} set={s("licenseNumber")} />
    </>);
    case "chat": return (<>
      <F label="Welcome Message" ph="Have questions?" value={c("welcomeMessage")} set={s("welcomeMessage")} />
      <F label="Response Email" ph="team@company.com" value={c("responseEmail")} set={s("responseEmail")} />
    </>);
    case "before_after": return (<>
      <F label="Title" ph="Before & After" value={c("title")} set={s("title")} />
      <ImageUploadField value={c("beforeImage") || null} onChange={(url) => uc("beforeImage", url || "")} label="Before Image" context="estimate-page" />
      <ImageUploadField value={c("afterImage") || null} onChange={(url) => uc("afterImage", url || "")} label="After Image" context="estimate-page" />
      <F label="Before Label" ph="Before" value={c("beforeLabel")} set={s("beforeLabel")} />
      <F label="After Label" ph="After" value={c("afterLabel")} set={s("afterLabel")} />
    </>);
    case "trust_badges":
      return <TrustBadgesFields section={section} onUpdateContent={uc} />;
    case "content_block":
      return <ContentBlockEditor section={section} onUpdateContent={uc} onBatchUpdateContent={ucBatch} />;
    case "custom_html":
      return (section.content as Partial<CustomHtmlContent>).blockId
        ? <BlockFieldsEditor section={section} onUpdateContent={uc} onBatchUpdateContent={ucBatch} />
        : <CustomHtmlEditor html={c("html")} css={c("css")} onHtml={(v) => uc("html", v)} onCss={(v) => uc("css", v)} onBatchUpdateContent={ucBatch} />;
    default: return null;
  }
}
