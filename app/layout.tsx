import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ListPilot — Compliant Rightmove listings in 20 seconds",
  description:
    "Paste your property facts. Get a Rightmove description, key features, Instagram, Facebook, LinkedIn, buyer email and window card — all checked against the DMCC Act 2024, NTSELAT and the Equality Act, automatically.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
