import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trace Engine",
  description: "Commerce reconciliation and attribution analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
