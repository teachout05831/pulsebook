"use client";

import "../../styles/animations.css";
import type { SectionProps } from "./sectionProps";
import { HeroSection } from "./HeroSection";
import { TrustBadgesSection } from "./TrustBadgesSection";
import { AboutSection } from "./AboutSection";
import { ScopeSection } from "./ScopeSection";
import { PricingSection } from "./PricingSection";
import { ApprovalSection } from "./ApprovalSection";
import { ContactSection } from "./ContactSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { GallerySection } from "./GallerySection";
import { FAQSection } from "./FAQSection";
import { TimelineSection } from "./TimelineSection";
import { VideoSection } from "./VideoSection";
import { VideoCallSection } from "./VideoCallSection";
import { CalendarSection } from "./CalendarSection";
import { PaymentSection } from "./PaymentSection";
import { ChatSection } from "./ChatSection";
import { BeforeAfterSection } from "./BeforeAfterSection";
import { ContentBlockSection } from "./ContentBlockSection";
import { CustomHtmlSection } from "./CustomHtmlSection";
import { NotesSection } from "./NotesSection";
import { CustomerInfoSection } from "./CustomerInfoSection";
import { CrewDetailsSection } from "./CrewDetailsSection";
import { AddressesSection } from "./AddressesSection";
import { ServicePickerSection } from "@/features/scheduling/components/sections/ServicePickerSection";
import { SchedulerSection } from "@/features/scheduling/components/sections/SchedulerSection";
import { BookingFormSection } from "@/features/scheduling/components/sections/BookingFormSection";

export function SectionRenderer(props: SectionProps) {
  if (!props.section.visible) return null;

  switch (props.section.type) {
    case "hero":
      return <HeroSection {...props} />;
    case "trust_badges":
      return <TrustBadgesSection {...props} />;
    case "about":
      return <AboutSection {...props} />;
    case "scope":
      return <ScopeSection {...props} />;
    case "pricing":
      return <PricingSection {...props} />;
    case "approval":
      return <ApprovalSection {...props} />;
    case "contact":
      return <ContactSection {...props} />;
    case "testimonials":
      return <TestimonialsSection {...props} />;
    case "project_photos":
    case "gallery":
      return <GallerySection {...props} />;
    case "faq":
      return <FAQSection {...props} />;
    case "timeline":
      return <TimelineSection {...props} />;
    case "video":
      return <VideoSection {...props} />;
    case "video_call":
      return <VideoCallSection {...props} />;
    case "calendar":
      return <CalendarSection {...props} />;
    case "payment":
      return <PaymentSection {...props} />;
    case "chat":
      return <ChatSection {...props} />;
    case "before_after":
      return <BeforeAfterSection {...props} />;
    case "content_block":
      return <ContentBlockSection {...props} />;
    case "custom_html":
      return <CustomHtmlSection {...props} />;
    case "notes":
      return <NotesSection {...props} />;
    case "customer_info":
      return <CustomerInfoSection {...props} />;
    case "crew_details":
      return <CrewDetailsSection {...props} />;
    case "addresses":
      return <AddressesSection {...props} />;
    case "service_picker":
      return <ServicePickerSection {...props} />;
    case "scheduler":
      return <SchedulerSection {...props} />;
    case "booking_form":
      return <BookingFormSection {...props} />;
    default:
      return null;
  }
}
