import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import ChatBot from "@/components/ChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Global Experience | Aligning Skills with Cooperate Goals",
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
  authors: [{ name: "Global Experience" }],
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "Global Experience | Aligning Skills with Cooperate Goals",
    description:
      "Join our international volunteer and placement programs. Support communities through cultural exchange, professional placements, and humanitarian programs.",
    type: "website",
    url: "https://globalexperiencegh.org",
    siteName: "Global Experience",
    images: [
      {
        url: "https://globalexperiencegh.org/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Global Experience Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Experience | Aligning Skills with Cooperate Goals",
    description:
      "Join our international volunteer and placement programs. Support communities through cultural exchange and humanitarian programs.",
    images: ["https://globalexperiencegh.org/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
          <ChatBot />
        </ThemeProvider>
      </body>
    </html>
  );
}
