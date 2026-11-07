import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Mail, Phone, MapPin, Globe, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-forest-800 flex items-center justify-center text-white">
                <Leaf className="w-5 h-5 text-emeraldBrand-light" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Feed<span className="text-emeraldBrand">Forward</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              "Share More. Waste Less. Feed Forward."
              <br />
              Bridging the gap between food abundance and food scarcity through community-powered donation redistribution.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#github"
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-forest-800 text-gray-400 hover:text-white flex items-center justify-center transition"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                aria-label="Twitter"
                className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-forest-800 text-gray-400 hover:text-white flex items-center justify-center transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-forest-800 text-gray-400 hover:text-white flex items-center justify-center transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emeraldBrand transition">Home</Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-emeraldBrand transition">Browse Available Food</Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-emeraldBrand transition">How It Works</a>
              </li>
              <li>
                <a href="#impact" className="hover:text-emeraldBrand transition">Our Impact</a>
              </li>
            </ul>
          </div>

          {/* User Roles */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Community</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/register?role=donor" className="hover:text-emeraldBrand transition">Become a Donor</Link>
              </li>
              <li>
                <Link to="/register?role=volunteer" className="hover:text-emeraldBrand transition">Join as Volunteer</Link>
              </li>
              <li>
                <Link to="/register?role=ngo" className="hover:text-emeraldBrand transition">Register NGO / Charity</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emeraldBrand transition">Member Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emeraldBrand" />
                <span>support@feedforward.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emeraldBrand" />
                <span>+1 (800) 555-FEED</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emeraldBrand shrink-0 mt-0.5" />
                <span>100 Green Innovation Way, San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} FeedForward Initiative. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for sustainable zero-hunger communities.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
