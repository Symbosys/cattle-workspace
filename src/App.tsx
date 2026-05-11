import React, { useState } from 'react';
import './index.css';
import { 
  Smartphone, 
  MapPin, 
  ChevronRight, 
  ShoppingBag, 
  Menu, 
  Heart,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Download,
  CheckCircle2,
  Users,
  MessageSquare,
  Sparkles
} from 'lucide-react';

import heroImg from './assets/hero.png';
import buffaloImg from './assets/buffalo.png';
import dogImg from './assets/dog.png';
import catImg from './assets/cat.png';
import mockupImg from './assets/mockup.png';
import patternImg from './assets/pattern.png';

export function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      title: 'Verified Listings',
      description: 'Every animal listing is verified by our team to ensure health and authenticity.',
      icon: <ShieldCheck size={28} />
    },
    {
      title: 'Instant Chat',
      description: 'Connect directly with sellers through our secure in-app messaging system.',
      icon: <MessageSquare size={28} />
    },
    {
      title: 'Real-time Prices',
      description: 'Stay updated with the latest market trends and cattle prices in your region.',
      icon: <Zap size={28} />
    },
    {
      title: 'Community Trusted',
      description: 'Join thousands of farmers and traders who trust CattleTrade daily.',
      icon: <Users size={28} />
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 flex justify-center pointer-events-none">
        <div className="nav-island glass-effect flex items-center justify-between px-8 py-3 pointer-events-auto w-full">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-[#2d5a27] p-2.5 rounded-xl group-hover:scale-110 transition-transform">
              <ShoppingBag className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#2d5a27]">
              Cattle<span className="text-[#d4a373]">Trade</span>
            </span>
          </div>

          <div className="hidden md:flex items-center bg-[#2d5a27]/5 rounded-2xl p-1 gap-1">
            <a href="#features" className="nav-link">Features</a>
            <a href="#discover" className="nav-link">Discover</a>
            <a href="#about" className="nav-link">About Us</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="btn-primary !px-6 !py-3 shadow-lg shadow-[#2d5a27]/20">
              <Download size={18} />
              Get the App
            </button>
            <button className="md:hidden p-2 text-[#2d5a27]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden glass-effect absolute top-[90px] right-6 left-6 p-8 rounded-[32px] space-y-6 animate-fade-in shadow-2xl pointer-events-auto border-[#eee]">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-xl font-bold text-[#1a1a1a]" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#discover" className="text-xl font-bold text-[#1a1a1a]" onClick={() => setIsMenuOpen(false)}>Discover</a>
              <a href="#about" className="text-xl font-bold text-[#1a1a1a]" onClick={() => setIsMenuOpen(false)}>About Us</a>
            </div>
            <hr className="border-[#eee]" />
            <button className="w-full btn-primary justify-center !py-4">
              <Download size={20} />
              Download App
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#2d5a27]/10 text-[#2d5a27] px-4 py-2 rounded-full text-sm font-bold mb-6 animate-fade-in">
              <Sparkles size={16} />
              The Future of Livestock Trading
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#1a1a1a] mb-8 animate-fade-in-up leading-tight">
              Trading Cattle Made <br />
              <span className="text-[#2d5a27]">Simple & Secure</span>
            </h1>
            <p className="text-xl text-[#666] mb-10 animate-fade-in-up delay-100 max-w-lg leading-relaxed">
              CattleTrade is the all-in-one mobile platform to discover, buy, and sell livestock. 
              Built for modern farmers who value time and transparency.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
              <a href="#" className="store-button">
                <Smartphone size={24} />
                <div className="text-left">
                  <div className="text-[10px] uppercase opacity-60">Download on</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </a>
              <a href="#" className="store-button">
                <Globe size={24} />
                <div className="text-left">
                  <div className="text-[10px] uppercase opacity-60">Get it on</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <div className="absolute inset-0 bg-[#2d5a27]/5 rounded-full blur-3xl -z-10 transform scale-150"></div>
            <img 
              src={mockupImg} 
              alt="CattleTrade App Mockup" 
              className="w-full max-w-lg mx-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.15)]"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6">Built for the Modern Farmer</h2>
            <p className="text-[#666] text-lg">Our mobile app brings the entire cattle market to your pocket with features designed for trust and ease.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="p-8 rounded-[40px] bg-[#f9f9f9] border border-[#eee] hover:border-[#2d5a27] transition-all group">
                <div className="feature-icon-wrapper group-hover:bg-[#2d5a27] group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-[#666] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section id="discover" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                <img src={heroImg} alt="Cattle" className="w-full h-64 object-cover rounded-[32px] mt-12" />
                <img src={buffaloImg} alt="Buffalo" className="w-full h-64 object-cover rounded-[32px]" />
                <img src={dogImg} alt="Dog" className="w-full h-64 object-cover rounded-[32px]" />
                <img src={catImg} alt="Cat" className="w-full h-64 object-cover rounded-[32px] mt-12" />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Millions of Livestock <br /> at Your Fingertips</h2>
              <p className="text-[#666] text-lg mb-8 leading-relaxed">
                Whether you're looking for high-yield dairy cows, strong buffaloes, or loyal companions, 
                our app connects you with verified sellers nationwide.
              </p>
              <ul className="space-y-4 mb-10">
                {['Cows & Buffaloes', 'Goats & Sheep', 'Horses & Camels', 'Domestic Pets'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-semibold text-[#1a1a1a]">
                    <CheckCircle2 className="text-[#2d5a27]" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="btn-outline">Learn More about Categories</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto mesh-gradient rounded-[60px] relative overflow-hidden group">
          {/* Decorative Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-10 mix-blend-overlay"
            style={{ backgroundImage: `url(${patternImg})`, backgroundSize: '400px' }}
          ></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center p-12 md:p-24">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-2 rounded-full text-sm font-bold mb-8">
                <Smartphone size={16} />
                Available on iOS & Android
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                Ready to start <br /> 
                <span className="text-[#d4a373]">Trading Cattle?</span>
              </h2>
              <p className="text-xl text-white/70 mb-12 max-w-lg leading-relaxed">
                Join over 50,000+ farmers already using CattleTrade to find the best livestock deals in their region.
              </p>
              <div className="flex flex-wrap gap-4">
                 <a href="#" className="glass-store-button">
                    <Smartphone size={28} />
                    <div className="text-left">
                      <div className="text-[10px] uppercase opacity-60">Download on</div>
                      <div className="text-sm font-bold">App Store</div>
                    </div>
                  </a>
                  <a href="#" className="glass-store-button">
                    <Globe size={28} />
                    <div className="text-left">
                      <div className="text-[10px] uppercase opacity-60">Get it on</div>
                      <div className="text-sm font-bold">Google Play</div>
                    </div>
                  </a>
              </div>
            </div>
            
            <div className="hidden md:block relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#d4a373]/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
              <img 
                src={mockupImg} 
                alt="App Interface" 
                className="w-full max-w-md mx-auto cta-floating-image drop-shadow-[0_40px_80px_rgba(0,0,0,0.3)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-[#0a1509] text-white pt-32 pb-12 px-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-[#2d5a27] p-2.5 rounded-xl">
                  <ShoppingBag className="text-white w-6 h-6" />
                </div>
                <span className="text-3xl font-bold tracking-tight text-white">
                  Cattle<span className="text-[#d4a373]">Trade</span>
                </span>
              </div>
              <p className="text-white/50 mb-10 leading-relaxed text-lg max-w-sm">
                Empowering the livestock industry through transparent, secure, and efficient mobile technology. Join the revolution today.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#2d5a27] hover:text-white transition-all text-white/50 border border-white/5">
                  <Globe size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#2d5a27] hover:text-white transition-all text-white/50 border border-white/5">
                  <Users size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#2d5a27] hover:text-white transition-all text-white/50 border border-white/5">
                  <Smartphone size={20} />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-lg mb-8 text-white">Quick Access</h4>
                <ul className="space-y-4">
                  <li><a href="#" className="footer-link">Features</a></li>
                  <li><a href="#" className="footer-link">How it Works</a></li>
                  <li><a href="#" className="footer-link">Marketplace</a></li>
                  <li><a href="#" className="footer-link">Safety First</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-8 text-white">Resources</h4>
                <ul className="space-y-4">
                  <li><a href="#" className="footer-link">Help Center</a></li>
                  <li><a href="#" className="footer-link">Privacy Policy</a></li>
                  <li><a href="#" className="footer-link">Terms of Use</a></li>
                  <li><a href="#" className="footer-link">Cookie Policy</a></li>
                </ul>
              </div>
            </div>

            {/* Newsletter Column */}
            <div className="lg:col-span-4">
              <div className="bg-white/5 rounded-[32px] p-8 border border-white/5 backdrop-blur-sm">
                <h4 className="font-bold text-xl mb-4 text-white">Join our Newsletter</h4>
                <p className="text-white/50 mb-6 text-sm">Stay updated with the latest livestock prices and market insights.</p>
                <div className="space-y-3">
                  <input type="email" placeholder="Email address" className="newsletter-input" />
                  <button className="w-full btn-primary !py-4 justify-center">
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 text-white/30 text-sm">
              <span>© 2026 CattleTrade Inc.</span>
              <div className="hidden md:block w-1 h-1 bg-white/10 rounded-full"></div>
              <span>All rights reserved.</span>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <ShieldCheck size={16} className="text-[#2d5a27]" />
                Verified Platform
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Globe size={16} className="text-[#2d5a27]" />
                English (US)
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
