import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estimate",
  description: "View your estimate",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
