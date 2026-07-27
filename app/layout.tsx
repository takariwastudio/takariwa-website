import type { Metadata } from "next";
import { Bebas_Neue, Jost } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-raw",
  display: "swap",
});

const jost = Jost({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body-raw",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://takariwa.studio"),
  title: "Takariwa Studio | Próximamente",
  description:
    "Estamos armando algo. Mientras tanto, escríbenos y déjanos hacer ruido creativo.",
  openGraph: {
    title: "Takariwa Studio | Próximamente",
    description:
      "Estamos armando algo. Mientras tanto, escríbenos y déjanos hacer ruido creativo.",
    url: "https://takariwa.studio",
    siteName: "Takariwa Studio",
    locale: "es_VE",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${bebasNeue.variable} ${jost.variable} font-body bg-ink text-paper min-h-dvh overflow-x-hidden bg-cover bg-center bg-no-repeat bg-[url('/texture-bg.svg')] md:bg-fixed`}
      >
        {children}
      </body>
    </html>
  );
}
