import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Global Experience Placements | Empowering Communities Through International Volunteerism",
  description:
    "International volunteer and placement organization dedicated to supporting students, graduates, interns, researchers, and volunteers through cultural exchange, professional placements, community development, and humanitarian support programs worldwide.",
  keywords: [
    "volunteer abroad",
    "international placements",
    "NGO",
    "community development",
    "humanitarian support",
    "cultural exchange",
    "medical placements",
    "teaching placements",
    "volunteer Africa",
  ],
  authors: [{ name: "Global Experience Placements" }],
  icons: {
    icon: "/images/logo.jpg",
  },
  openGraph: {
    title: "Global Experience Placements | Empowering Communities",
    description:
      "Join our international volunteer and placement programs. Support communities through cultural exchange, professional placements, and humanitarian programs.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Experience Placements | Empowering Communities",
    description:
      "Join our international volunteer and placement programs. Support communities through cultural exchange and humanitarian programs.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
