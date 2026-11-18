import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEUROSCREEN AI — Multimodal Mental Health Screening",
  description: "Prototype platform for research on multimodal mental health screening in university students.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
