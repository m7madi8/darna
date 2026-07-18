import type { Metadata, Viewport } from "next";
import { Cairo, Cinzel, Montserrat } from "next/font/google";
import { Providers } from "@/components/providers";
import "./fonts-aref-ruqaa.css";
import "./globals.css";

/**
 * DARNA Latin wordmark —
 * Avenir Next → Circular Std → Montserrat (web)
 */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-montserrat",
  display: "swap",
});

/** VIP display — classical luxury serif */
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-vip",
  display: "swap",
});

/**
 * Body UI — Cairo for regular Arabic (and Latin UI).
 * Warm, clear Naskh-like screen face; Aref Ruqaa stays for دارنا + headings.
 */
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body-ar",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://darna-wine.vercel.app"),
  title: {
    default: "DARNA · دارنا",
    template: "%s · DARNA",
  },
  description:
    "دارنا — احجز طاولتك في رام الله | Darna — reserve your table in the heart of Ramallah",
  icons: {
    icon: "/logo1.png",
    apple: "/logo1.png",
  },
  openGraph: {
    type: "website",
    locale: "ar_PS",
    url: "/",
    siteName: "DARNA",
    title: "DARNA · دارنا",
    description:
      "دارنا — احجز طاولتك في رام الله | Darna — reserve your table in the heart of Ramallah",
    images: [
      {
        url: "/darnaramallah.jpg",
        width: 1080,
        height: 1080,
        alt: "DARNA · دارنا",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DARNA · دارنا",
    description:
      "دارنا — احجز طاولتك في رام الله | Darna — reserve your table in the heart of Ramallah",
    images: ["/darnaramallah.jpg"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DARNA",
  },
  formatDetection: {
    telephone: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#234431",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/aref-ruqaa-700-arabic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/aref-ruqaa-400-arabic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${montserrat.variable} ${cinzel.variable} ${cairo.variable} ${cairo.className}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
