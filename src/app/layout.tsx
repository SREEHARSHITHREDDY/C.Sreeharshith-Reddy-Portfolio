import type { Metadata, Viewport } from "next";
import "@fontsource/bebas-neue/400.css";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "./globals.css";
import { site } from "@/data";

export const metadata: Metadata = {
  title: site.brand,
  description: site.description,
  keywords: ["C. Sree Harshith Reddy", "portfolio", "AI", "machine learning", "RainC", "Hyderabad", "Woxsen University"],
  authors: [{ name: site.name, url: site.socials.linkedin.url }],
  openGraph: { title: site.brand, description: site.description, type: "website" },
  twitter: { card: "summary", title: site.brand, description: site.description },
};

export const viewport: Viewport = {
  themeColor: site.colors.bg,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
