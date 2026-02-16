import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { RefineProvider } from "@/providers/refine-provider";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { InstallPrompt } from "@/components/InstallPrompt";

export const viewport: Viewport = {
  themeColor: "#111827",
};

export const metadata: Metadata = {
  title: "ServicePro",
  description: "Service business management platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ServicePro",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="antialiased">
        <Suspense fallback={<PageSkeleton header cards={4} tableRows={5} />}>
          <RefineProvider>{children}</RefineProvider>
        </Suspense>
        <Toaster richColors position="top-right" />
        <ServiceWorkerRegistration />
        <InstallPrompt />
      </body>
    </html>
  );
}
