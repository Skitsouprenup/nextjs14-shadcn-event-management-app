import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from '@clerk/nextjs'

//Default font for the entire app
const inter = Inter({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "Get Event",
  description: "Event Management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
