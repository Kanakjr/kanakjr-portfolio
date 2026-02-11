import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import QuickNav from "@/components/QuickNav";
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
          {/* Logo at top left */}
          <Link href="/" className="fixed top-8 left-8 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-cyber-yellow/50 transition-all duration-300 hover:scale-110 cursor-pointer">
            <div className="relative w-6 h-6">
              <Image
                src="/logokanakjr.png"
                alt="Kanak Jr Logo"
                fill
                className="rounded-full object-cover"
                priority
              />
            </div>
          </Link>
          
          {/* Navigation Menu */}
          <QuickNav />
          
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
