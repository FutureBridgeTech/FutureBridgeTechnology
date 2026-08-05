import * as React from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface ContentBlock {
  type: string;
  text: string;
}

interface DynamicPageLayoutProps {
  title: string;
  content: ContentBlock[];
}

export function DynamicPageLayout({ title, content }: DynamicPageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 text-slate-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <AnimatedSection>
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-6">
              {title}
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
          </div>
        </AnimatedSection>

        <div className="space-y-6">
          {content.map((block, index) => {
            const isHeading = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(block.type);
            const isList = block.type === "li";
            const Tag = block.type as React.ElementType;

            return (
              <AnimatedSection key={index} delay={index * 0.02}>
                {isHeading && (
                  <Tag className={`font-semibold text-slate-100 ${block.type === 'h2' ? 'text-3xl mt-12 mb-6' : block.type === 'h3' ? 'text-2xl mt-8 mb-4' : 'text-xl mt-6 mb-3'}`}>
                    {block.text as React.ReactNode}
                  </Tag>
                )}
                
                {block.type === "p" && (
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {block.text}
                  </p>
                )}

                {isList && (
                  <div className="flex items-start space-x-3 text-lg font-medium bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-6 h-6 text-cyan-500 shrink-0 mt-0.5" />
                    <span className="text-slate-300">{block.text}</span>
                  </div>
                )}
              </AnimatedSection>
            );
          })}
        </div>
        
        <AnimatedSection className="mt-16 text-center border-t border-slate-800 pt-16">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Take the Next Step?</h2>
          <Link href="/contact" className={buttonVariants({ size: "lg", className: "rounded-full px-8 text-lg" })}>
            Contact Us Today
          </Link>
        </AnimatedSection>
      </div>
    </div>
  );
}
