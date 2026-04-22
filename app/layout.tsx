import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "MOSO — Design Your Future | Brand, Web & Growth Studio",
    template: "%s | MOSO",
  },
  description:
    "MOSO is a design and technology studio helping ambitious brands build clarity, presence, and momentum through strategy, branding, web design, digital products, and growth systems.",
  keywords: ["brand strategy", "web design", "digital design", "Webflow development", "SEO", "AEO", "growth marketing", "design studio", "Louisiana creative studio"],
  authors: [{ name: "MOSO", url: "https://www.moso.marketing" }],
  creator: "MOSO",
  publisher: "MOSO",
  metadataBase: new URL("https://www.moso.marketing"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.moso.marketing",
    siteName: "MOSO",
    title: "MOSO — Design Your Future | Brand, Web & Growth Studio",
    description: "MOSO helps brands clarify who they are, build what they need, and grow with intention — through strategy, design, technology, and thoughtful marketing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOSO — Design Your Future | Brand, Web & Growth Studio",
    description: "MOSO helps brands clarify who they are, build what they need, and grow with intention — through strategy, design, technology, and thoughtful marketing.",
    creator: "@moso_marketing",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/webclip.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        {/* Preconnect for external JS (Webflow/jQuery CDN) */}
        <link rel="preconnect" href="https://d3e54v103j8qbb.cloudfront.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://d3e54v103j8qbb.cloudfront.net" />
        {/* Preload critical CSS so it arrives before render */}
        <link rel="preload" href="/css/normalize.css" as="style" />
        <link rel="preload" href="/css/webflow.css" as="style" />
        <link rel="preload" href="/css/moso-test-2-4b0411.webflow.css" as="style" />
        <link href="/css/normalize.css" rel="stylesheet" type="text/css" />
        <link href="/css/webflow.css" rel="stylesheet" type="text/css" />
        <link href="/css/moso-test-2-4b0411.webflow.css" rel="stylesheet" type="text/css" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Script
          src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=67ea24be240797066a84755c"
          strategy="afterInteractive"
        />
        <Script src="/js/webflow.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
