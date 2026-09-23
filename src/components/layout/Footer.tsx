import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';
// @ts-ignore
import { GlassCard, MagneticButton } from '@/components/ui/react-bits';

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-foreground/[0.06] bg-background/40 backdrop-blur-xl pt-20 pb-10 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & About */}
          <div className="space-y-6">
            <Link to="/" className="font-display text-2xl font-bold tracking-tight text-gradient inline-block">
              SnapCart
            </Link>
            <p className="text-foreground/60 text-sm leading-relaxed max-w-xs">
              Elevating your lifestyle with premium, curated essentials. Discover quality without compromise.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass bg-foreground/[0.03] hover:bg-foreground/[0.1] flex items-center justify-center text-foreground/70 hover:text-emerald-400 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass bg-foreground/[0.03] hover:bg-foreground/[0.1] flex items-center justify-center text-foreground/70 hover:text-emerald-400 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass bg-foreground/[0.03] hover:bg-foreground/[0.1] flex items-center justify-center text-foreground/70 hover:text-emerald-400 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass bg-foreground/[0.03] hover:bg-foreground/[0.1] flex items-center justify-center text-foreground/70 hover:text-emerald-400 transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-foreground/60">
              <li>
                <Link to="/products" className="hover:text-emerald-400 transition-colors">Shop All</Link>
              </li>
              <li>
                <Link to="/products?category=kitchen" className="hover:text-emerald-400 transition-colors">Kitchen</Link>
              </li>
              <li>
                <Link to="/products?category=home" className="hover:text-emerald-400 transition-colors">Home Decor</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-emerald-400 transition-colors">Track Order</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-foreground font-semibold mb-6">Customer Service</h4>
            <ul className="space-y-4 text-sm text-foreground/60">
              <li>
                <Link to="/faq" className="hover:text-emerald-400 transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-emerald-400 transition-colors">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-emerald-400 transition-colors">Returns & Exchanges</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-foreground font-semibold mb-6">Stay Connected</h4>
            <p className="text-foreground/60 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full glass bg-foreground/[0.03] border-foreground/[0.08] rounded-xl h-12 px-4 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:bg-foreground/[0.06] focus:border-emerald-500/50 transition-all"
              />
              <MagneticButton>
                <button type="submit" className="w-full glass-button-primary">
                  Subscribe
                </button>
              </MagneticButton>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-foreground/[0.06] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-foreground/40">
          <p>© {new Date().getFullYear()} SnapCart. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
