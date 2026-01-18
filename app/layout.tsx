import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { RefineProvider } from "@/providers/refine-provider";

export const metadata: Metadata = {
  title: "ServicePro",
  description: "Service business management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          <RefineProvider>{children}</RefineProvider>
        </Suspense>
      </body>
    </html>
  );
}
