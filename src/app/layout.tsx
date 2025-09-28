import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import DisableImageInteractions from "@/components/DisableImageInteractions";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "evolvia",
  description: "An IEDC flagship event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interTight.variable} font-sans antialiased`}
      >
        <DisableImageInteractions />
        {children}
      </body>
    </html>
  );
}
