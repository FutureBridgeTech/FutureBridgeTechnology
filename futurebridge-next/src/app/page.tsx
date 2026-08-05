import { AnimatedSection } from "@/components/AnimatedSection";
import { ServiceCard } from "@/components/ServiceCard";
import { StatCounter } from "@/components/StatCounter";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { ContactForm } from "@/components/ContactForm";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Code, Database, Cloud, LineChart, Shield, Smartphone } from "lucide-react";
import Link from "next/link";

export default function Home() {
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-background to-background z-0" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Let's Secure Your <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                U.S. Tech Career
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop sending automated resumes into a black hole. Speak with a placement specialist and mapping advisor. We will review your profile and match you with active vendor client job positions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#contact" className={buttonVariants({ size: "lg", className: "rounded-full px-8 text-lg" })}>
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="#services" className={buttonVariants({ size: "lg", variant: "outline", className: "rounded-full px-8 text-lg" })}>
                View Services
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCounter value={500} label="Consultants Placed" suffix="+" />
            <StatCounter value={98} label="Success Rate" suffix="%" />
            <StatCounter value={150} label="Active Clients" suffix="+" />
            <StatCounter value={10} label="Years Experience" suffix="+" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We provide end-to-end solutions for international students and IT professionals seeking secure, high-paying roles in the United States.
            </p>
          </AnimatedSection>

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

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-950 text-slate-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Success Stories</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Hear from our consultants who successfully navigated the U.S. job market with our guidance.
            </p>
          </AnimatedSection>
          <TestimonialSlider />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/5 to-transparent -z-10" />
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Career?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you're an F-1 student looking for your first OPT role, or an experienced H-1B candidate seeking better opportunities, our experts are here to help.
            </p>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                  <span className="font-bold text-xl">1</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Submit Profile</h4>
                  <p className="text-muted-foreground">Fill out the consultation form with your visa status and target role.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <span className="font-bold text-xl">2</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Strategy Call</h4>
                  <p className="text-muted-foreground">Speak with a placement advisor to map out your career trajectory.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                  <span className="font-bold text-xl">3</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Get Placed</h4>
                  <p className="text-muted-foreground">We market your profile, prepare you for interviews, and secure your offer.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <ContactForm />
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
