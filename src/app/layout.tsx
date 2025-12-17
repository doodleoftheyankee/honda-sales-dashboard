import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Union Park Honda - Sales Dashboard",
  description: "Monthly sales tracking dashboard for Union Park Honda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#0a0a0a]">
        {children}
      </body>
    </html>
  );
}
