import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { IntroLoader } from "@/components/ui/intro-loader";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const BASE_URL = "https://www.andrey.dev.br";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#a0724a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Andrey Rattes — Engenheiro Frontend",
    template: "%s · Andrey Rattes",
  },
  description:
    "Engenheiro frontend com foco em fintech, sistemas críticos e automação com IA. Construo interfaces que aguentam produção: performance, observabilidade e arquitetura que escala.",
  authors: [{ name: "Andrey Rattes", url: BASE_URL }],
  creator: "Andrey Rattes",
  publisher: "Andrey Rattes",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    siteName: "Andrey Rattes",
    title: "Andrey Rattes — Engenheiro Frontend",
    description:
      "Fintech, sistemas críticos e automação com IA. Interfaces que operam em produção real.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrey Rattes — Engenheiro Frontend",
    description:
      "Fintech, sistemas críticos e automação com IA. Interfaces que operam em produção real.",
    creator: "@mechamoandrey",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Andrey Rattes",
    url: BASE_URL,
    jobTitle: "Engenheiro Frontend",
    description:
      "Engenheiro frontend com foco em fintech, sistemas críticos e automação com IA.",
    knowsAbout: [
      "React",
      "Next.js",
      "Angular",
      "TypeScript",
      "GSAP",
      "Framer Motion",
      "Core Web Vitals",
      "Fintech",
      "Sistemas distribuídos",
    ],
    sameAs: [
      "https://github.com/mechamoandrey",
      "https://www.linkedin.com/in/andrey-azevedo/",
    ],
  };

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${jakartaSans.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://d8j0ntlcm91z4.cloudfront.net"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://d8j0ntlcm91z4.cloudfront.net" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ScrollProgress />
          <IntroLoader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
