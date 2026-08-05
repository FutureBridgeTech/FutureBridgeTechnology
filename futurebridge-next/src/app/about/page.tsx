import { AnimatedSection } from "@/components/AnimatedSection";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      <section className="py-20 bg-slate-50 dark:bg-slate-900/20">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About FutureBridge</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We are a premier IT staffing and consulting firm dedicated to bridging the gap between top-tier technical talent and leading U.S. enterprises.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <div className="aspect-square bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 rounded-3xl border border-cyan-500/10 p-8 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-4xl font-bold text-foreground mb-4">10+ Years</h3>
                <p className="text-lg text-muted-foreground">Of Excellence in IT Staffing & Placement</p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is to empower international students (OPT/CPT) and experienced IT professionals (H-1B, Green Card) by providing unparalleled placement services, immigration compliance guidance, and technical upskilling.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe that talented engineers shouldn't have to struggle with broken ATS systems and endless recruiting layers. We take you directly to the source.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                "Direct Prime Vendor Relationships",
                "In-house Technical Mentorship",
                "Full Immigration & Visa Support",
                "Transparent Rate Structures"
              ].map((item, i) => (
                <li key={i} className="flex items-center space-x-3 text-lg font-medium">
                  <CheckCircle2 className="w-6 h-6 text-cyan-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-8">
              <Link href="/contact" className={buttonVariants({ size: "lg", className: "rounded-full" })}>
                Speak with our Team <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
