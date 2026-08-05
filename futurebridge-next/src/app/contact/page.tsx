import { AnimatedSection } from "@/components/AnimatedSection";
import { ContactForm } from "@/components/ContactForm";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      <section className="py-20 bg-slate-50 dark:bg-slate-900/20">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to secure your next role? Reach out to our placement specialists today.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <AnimatedSection className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-lg text-muted-foreground">
                We're here to answer any questions about our placement processes, visa sponsorship capabilities, or technical training cohorts.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-1">Call Us</h4>
                  <p className="text-muted-foreground">+1 (917) 755-0774</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-1">Email Strategy Team</h4>
                  <p className="text-muted-foreground">placements@futurebridgetech.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-1">Global Headquarters</h4>
                  <p className="text-muted-foreground">Salt Lake City, UT, USA</p>
                  <p className="text-muted-foreground">Gandhinagar, GJ, India</p>
                  <p className="text-muted-foreground">Dubai, UAE</p>
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
