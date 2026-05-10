import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Traveloop | Personalized Travel Planning",
  description: "Create, plan, and share your perfect multi-city itineraries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased dark`}
    >
      <body className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}
