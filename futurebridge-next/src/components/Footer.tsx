import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-12 md:py-16 border-t border-slate-900 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            FutureBridge
          </span>
          <p className="text-sm text-slate-400 max-w-xs">
            Securing top-tier U.S. IT careers through strategic placement, compliance guidance, and specialized training.
          </p>
          <div className="flex space-x-4 pt-2">
            <Link href="#" aria-label="WhatsApp" className="hover:text-green-400 transition-colors"><FaWhatsapp className="w-5 h-5" /></Link>
            <Link href="#" aria-label="LinkedIn" className="hover:text-blue-400 transition-colors"><FaLinkedin className="w-5 h-5" /></Link>
            <Link href="#" aria-label="Instagram" className="hover:text-pink-400 transition-colors"><FaInstagram className="w-5 h-5" /></Link>
            <Link href="#" aria-label="Twitter" className="hover:text-cyan-400 transition-colors"><FaTwitter className="w-5 h-5" /></Link>
            <Link href="#" aria-label="Facebook" className="hover:text-blue-500 transition-colors"><FaFacebook className="w-5 h-5" /></Link>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-cyan-400 transition-colors">Services</Link></li>
            <li><Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services" className="hover:text-cyan-400 transition-colors">Direct Placement</Link></li>
            <li><Link href="/services" className="hover:text-cyan-400 transition-colors">Visa Sponsorship</Link></li>
            <li><Link href="/services" className="hover:text-cyan-400 transition-colors">Technical Training</Link></li>
            <li><Link href="/services" className="hover:text-cyan-400 transition-colors">Resume Marketing</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>Salt Lake City, UT, USA</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>+1 (917) 755-0774</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>placements@futurebridgetech.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} FutureBridge Technologies. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
