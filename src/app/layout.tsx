import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Godfather OS",
  description: "Elite AI-powered command center for intelligent automation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="mobile-container">
          {children}
        </div>
      </body>
    </html>
  );
}
