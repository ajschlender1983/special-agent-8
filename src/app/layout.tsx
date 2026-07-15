import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Special Agent #8 — Light Pump Labs | Conversational Intelligence",
  description: "Personalized experience engine with integrated components, application forms, and dynamic galleries. Powered by LPL ecosystem.",
  keywords: ["AI", "Experience", "Light Pump Labs", "LPL", "Agent"],
  authors: [{ name: "Light Pump Labs" }],
  openGraph: {
    title: "Special Agent #8 — Conversational Intelligence",
    description: "Personalized experience engine for the LPL ecosystem",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Special Agent #8",
    description: "Conversational intelligence for personalized experiences",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
