import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google";

const baiJamjuree = Bai_Jamjuree({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body-raw",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Todos los trabajos | Takariwa Studio",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function TrabajosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={baiJamjuree.variable}>{children}</div>;
}
