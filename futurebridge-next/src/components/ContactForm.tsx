"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    // Replace with actual Web3Forms key if provided, or fallback
    formData.append("access_key", "YOUR_WEB3FORMS_ACCESS_KEY_HERE");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert("Something went wrong during submission.");
      }
    } catch (error) {
      alert("Network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative w-full max-w-xl mx-auto bg-card border border-border p-8 rounded-2xl shadow-xl shadow-cyan-900/5">
      <AnimatePresence>
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-card rounded-2xl p-8 text-center"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for reaching out to FutureBridge Technologies. A Placement Advisor will contact you within 24 hours.
            </p>
            <Button onClick={() => setIsSuccess(false)} variant="outline">
              Submit Another
            </Button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                Book a Free Placement Session
              </h3>
              <p className="text-sm text-muted-foreground">
                Takes 2 minutes. We reply in under 24 hours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+1 (123) 456-7890" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visa">Current Visa Status</Label>
                <Select name="visa" required>
                  <SelectTrigger id="visa">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="F1-OPT">F-1 OPT</SelectItem>
                    <SelectItem value="STEM-OPT">STEM OPT Extension</SelectItem>
                    <SelectItem value="H1B">H-1B Candidate</SelectItem>
                    <SelectItem value="CPT">F-1 CPT</SelectItem>
                    <SelectItem value="EAD">L2/H4 EAD or Green Card</SelectItem>
                    <SelectItem value="Other">Other Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Target Placement Role</Label>
              <Select name="role" required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select target role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Software-Engineer">Software Engineer / Web Developer</SelectItem>
                  <SelectItem value="Data-Analyst">Data Analyst / Scientist / Engineer</SelectItem>
                  <SelectItem value="Cloud-Architect">Cloud/DevOps Engineer</SelectItem>
                  <SelectItem value="Product-Manager">Product / Project Manager</SelectItem>
                  <SelectItem value="QA-Engineer">QA / Testing Engineer</SelectItem>
                  <SelectItem value="Other">Other Specialized Domain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Additional Context (Optional)</Label>
              <Textarea id="message" name="message" placeholder="Briefly describe your situation..." className="resize-none" rows={3} />
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit My Application"
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
