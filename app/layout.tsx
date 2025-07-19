import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StoreProvider from "@/store/StoreProvider";
import { SealDecayEffect } from "@/components/SealDecayEffect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Silly Seal",
  description: "Take care of your silly seal!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-svh p-4 flex flex-col`}
      >
        <StoreProvider>
          <SealDecayEffect />
          <div className="flex flex-shrink-0">
            <Navbar />
          </div>
          <div className="flex justify-center items-center w-full h-full">
            <div className="max-w-lg h-full w-full">{children}</div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
