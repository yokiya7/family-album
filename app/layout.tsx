import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Family Album Portfolio",
  description: "Interactive family photo album portfolio.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
