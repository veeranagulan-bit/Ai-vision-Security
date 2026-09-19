import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GuardianVision AI",
  description: "AI-Powered Real-Time Security & Threat Detection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
