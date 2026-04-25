import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScoutEdge Content Ops Agent",
  description: "Internal content operations for generating and reviewing platform-specific ScoutEdge social drafts."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
