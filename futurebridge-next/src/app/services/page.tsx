import { AnimatedSection } from "@/components/AnimatedSection";
import { ServiceCard } from "@/components/ServiceCard";
import { Code, Database, Cloud, LineChart, Shield, Smartphone } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      title: "Direct Client Placements",
      description: "Bypass vendor layers. We market your profile directly to prime vendors and end clients, increasing your chances of securing high-paying roles.",
      icon: <Database className="w-6 h-6" />,
    },
    {
      title: "Visa Sponsorship & Compliance",
      description: "Comprehensive guidance for F-1 OPT, STEM OPT, H-1B, and CPT candidates. We ensure full immigration compliance throughout your placement.",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: "Resume & Profile Marketing",
      description: "Our experts engineer your resume to pass ATS filters and highlight your true potential, making you irresistible to IT recruiters.",
      icon: <LineChart className="w-6 h-6" />,
    },
    {
      title: "Technical Interview Prep",
      description: "1-on-1 mock interviews, system design training, and behavioral coaching to help you clear client rounds with confidence.",
      icon: <Code className="w-6 h-6" />,
    },
    {
      title: "Cloud & DevOps Training",
      description: "Upskill in the latest enterprise technologies including AWS, Azure, CI/CD, and Kubernetes to meet current market demands.",
      icon: <Cloud className="w-6 h-6" />,
    },
    {
      title: "Continuous Support",
      description: "From day one of your project to your next contract renewal, our team provides ongoing HR, technical, and immigration support.",
      icon: <Smartphone className="w-6 h-6" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-20">
      <section className="py-20 bg-slate-50 dark:bg-slate-900/20">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              End-to-end IT placement, upskilling, and immigration support services designed for the modern U.S. tech market.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <ServiceCard
                key={idx}
                index={idx}
                title={service.title}
                description={service.description}
                icon={service.icon}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
