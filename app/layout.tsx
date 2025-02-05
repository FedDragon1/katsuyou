import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Katsuyou",
  description: "Online, free, infinite practices for Japanese verbs and adjectives",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased m-0 p-0`}
      >
        {children}
      </body>
    </html>
  );
}
