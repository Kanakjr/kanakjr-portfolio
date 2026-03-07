import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import QuickNav from "@/components/QuickNav";
import JarvisChat from "@/components/JarvisChat";
import Terminal from "@/components/Terminal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kanak Dahake Jr | Developer & Designer",
  description: "Portfolio website of Kanak Dahake Jr - Developer, Designer, and Maker",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Navigation (includes logo on both mobile and desktop) */}
          <QuickNav />
          
          {children}
          
          {/* Jarvis AI Assistant */}
          <JarvisChat />
          
          {/* Terminal overlay (backtick to toggle) */}
          <Terminal />
        </ThemeProvider>
      </body>
    </html>
  );
}
