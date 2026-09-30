import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/LegalPage";
import { isLocale, localePath } from "@/config/site";
import { LEGAL } from "@/content/legal";

type P = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: `${LEGAL[lang].privacy.title} · Chaster`,
    alternates: {
      canonical: localePath(lang, "/privacy"),
      languages: { ka: localePath("ka", "/privacy"), en: localePath("en", "/privacy") },
    },
  };
}

export default async function Page({ params }: P) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <LegalPage locale={lang} doc={LEGAL[lang].privacy} />;
}
