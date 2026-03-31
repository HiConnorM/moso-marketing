import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Moso — Creative Studio | Design Your Future | Global Branding, Marketing & Software Design",
  description: "Moso is a boutique creative agency crafting world-class branding, marketing, website design, and custom software. Born in Louisiana, building the future worldwide.",
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
    <html lang="en">
      <head>
        <link href="/css/normalize.css" rel="stylesheet" type="text/css" />
        <link href="/css/webflow.css" rel="stylesheet" type="text/css" />
        <link href="/css/moso-test-2-4b0411.webflow.css" rel="stylesheet" type="text/css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);`
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
            `
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
