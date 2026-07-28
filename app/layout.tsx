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

const SITE_URL = "https://takariwa.studio";
const TITLE = "Takariwa Studio | Próximamente";
const DESCRIPTION =
  "Estudio creativo en Venezuela. Estamos armando algo. Mientras tanto, escríbenos y déjanos hacer ruido creativo.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | Takariwa Studio" },
  description: DESCRIPTION,
  keywords: [
    "Takariwa Studio",
    "estudio creativo Venezuela",
    "diseño web Venezuela",
    "desarrollo web Venezuela",
    "disturbio creativo",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Takariwa Studio",
    locale: "es_VE",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Takariwa Studio | Próximamente",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: "rZc30PPfJXMEW_2MUc58R5ZWMcmPfjE-MMnrCFZMg9w",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Takariwa Studio",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  email: "hola@takariwa.studio",
  sameAs: [
    "https://www.instagram.com/takariwa.studio",
    "https://www.linkedin.com/company/takariwa-studio/",
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </body>
    </html>
  );
}
