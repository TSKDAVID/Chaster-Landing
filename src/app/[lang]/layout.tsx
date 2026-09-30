import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { CellSprite } from "@/components/cell/CellSprite";
import { LOCALES, isLocale, localePath, site, type Locale } from "@/config/site";
import { getCopy } from "@/content";
import { semibold, text } from "../fonts";
import "../globals.css";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0D0A1B",
};

const OG_LOCALE: Record<Locale, string> = { ka: "ka_GE", en: "en_US" };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = getCopy(lang);
  return {
    metadataBase: new URL(site.url),
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: {
      canonical: localePath(lang),
      languages: { ka: localePath("ka"), en: localePath("en"), "x-default": localePath("ka") },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: copy.meta.title,
      description: copy.meta.description,
      locale: OG_LOCALE[lang],
      alternateLocale: OG_LOCALE[lang === "ka" ? "en" : "ka"],
      url: localePath(lang),
      images: [{ url: `/og/${lang}.png`, width: 1200, height: 630, alt: copy.meta.title }],
    },
    twitter: { card: "summary_large_image", title: copy.meta.title, description: copy.meta.description, images: [`/og/${lang}.png`] },
  };
}

/**
 * The first visit of a session assembles the mark in the nav (§1.9). This runs before first paint, adds one class to
 * <html>, and is the only thing that decides; CSS does the animating. Stored per session, so it plays once.
 */
const SESSION_ASSEMBLE = `try{if(!sessionStorage.getItem('ch_a')){sessionStorage.setItem('ch_a','1');document.documentElement.classList.add('ch-a')}}catch(e){}`;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = getCopy(lang);

  return (
    // the inline script below adds `ch-a` to <html> before hydration on purpose
    <html lang={lang} className={`${semibold.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SESSION_ASSEMBLE }} />
      </head>
      <body>
        <a href="#main" className="skip">
          {copy.a11y.skip}
        </a>
        <CellSprite />
        {children}
      </body>
    </html>
  );
}
