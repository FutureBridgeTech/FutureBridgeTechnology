import { getPageData, getAllPaths } from "@/lib/data";
import { DynamicPageLayout } from "@/components/DynamicPageLayout";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export function generateStaticParams() {
  const paths = getAllPaths().filter(p => p.split('/').length === 2 && p !== '/');
  return paths.map((p) => ({
    slug: p.replace('/', ''),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = getPageData(`/${slug}`);
  if (!data) return {};
  return { title: data.title };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getPageData(`/${slug}`);
  if (!data) return notFound();
  return <DynamicPageLayout title={data.title} content={data.content} />;
}
