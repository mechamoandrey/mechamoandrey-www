import type { Metadata } from "next";
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

const BASE_URL = "https://andreyrattes.dev";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Andrey Rattes · Engenheiro Frontend Sênior",
    template: "%s · Andrey Rattes",
  },
  description:
    "Engenheiro frontend sênior com foco em fintech, sistemas de alta disponibilidade e automação com IA. Angular, React, Next.js, GSAP, performance e observabilidade em produção.",
  keywords: [
    "engenheiro frontend",
    "desenvolvedor frontend sênior",
    "React",
    "Next.js",
    "Angular",
    "TypeScript",
    "fintech",
    "performance web",
    "Core Web Vitals",
    "automação IA",
  ],
  authors: [{ name: "Andrey Rattes", url: BASE_URL }],
  creator: "Andrey Rattes",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    siteName: "Andrey Rattes",
    title: "Andrey Rattes · Engenheiro Frontend Sênior",
    description:
      "Fintech, sistemas críticos e automação com IA. Interfaces que operam em produção real — observabilidade, zero-downtime, magnitude.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Andrey Rattes — Engenheiro Frontend Sênior",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrey Rattes · Engenheiro Frontend Sênior",
    description:
      "Fintech, sistemas críticos e automação com IA. Interfaces que operam em produção real.",
    images: ["/og-image.png"],
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
    jobTitle: "Engenheiro Frontend Sênior",
    description:
      "Engenheiro frontend com foco em fintech, sistemas de alta disponibilidade e automação com IA.",
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
