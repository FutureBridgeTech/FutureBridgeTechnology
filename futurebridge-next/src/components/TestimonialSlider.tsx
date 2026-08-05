"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  name: string;
  title: string;
  visa: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Anisha Mehta",
    title: "Cloud Solutions Architect @ Oracle",
    visa: "STEM OPT Candidate",
    rating: 5,
    content:
      "Anisha completed her MS in Computer Science but was struggling to get callbacks. The FutureBridge team engineered her resume and marketed her profile. She secured 4 client interviews within the first week and landed a role at Oracle.",
  },
  {
    name: "Karthik Patel",
    title: "Data Engineer @ Cognizant",
    visa: "H-1B Visa Placed",
    rating: 5,
    content:
      "Karthik wanted a corporate Data Engineering position but faced barriers finding H-1B sponsors. We marketed his profile directly to supportive clients. He was placed at Cognizant and his H-1B sponsorship petition was selected.",
  },
  {
    name: "Jack Chen",
    title: "Frontend Developer @ Stripe",
    visa: "F-1 OPT Candidate",
    rating: 5,
    content:
      "Jack was consistently getting rejected at the final round stage. Our technical coaches worked 1-on-1 with Jack using recording analytics. He secured a position at Stripe and successfully negotiated a higher base salary.",
  },
];

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-12 py-8">
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/50 backdrop-blur-sm"
        onClick={prev}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card/30 backdrop-border-sm border-cyan-500/20">
              <CardContent className="p-8 md:p-12 flex flex-col items-center text-center space-y-6">
                <div className="flex space-x-1 text-yellow-500">
                  {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-lg md:text-xl text-muted-foreground italic leading-relaxed">
                  "{testimonials[currentIndex].content}"
                </p>
                <div>
                  <h4 className="text-lg font-bold text-foreground">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-sm font-medium text-cyan-500">
                    {testimonials[currentIndex].title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {testimonials[currentIndex].visa}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/50 backdrop-blur-sm"
        onClick={next}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      <div className="flex justify-center space-x-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex ? "bg-cyan-500 w-6" : "bg-muted hover:bg-muted-foreground"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
