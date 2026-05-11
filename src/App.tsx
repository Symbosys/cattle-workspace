import React, { useState } from 'react';
import './index.css';
import { 
  Search, 
  MapPin, 
  ChevronRight, 
  ShoppingBag, 
  User, 
  Menu, 
  Heart,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Plus
} from 'lucide-react';
import { APITester } from "./APITester";

import heroImg from './assets/hero.png';
import buffaloImg from './assets/buffalo.png';
import dogImg from './assets/dog.png';
import catImg from './assets/cat.png';

export function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    { name: 'Cows', icon: '🐄', count: '1.2k+' },
    { name: 'Buffaloes', icon: '🐃', count: '850+' },
    { name: 'Goats', icon: '🐐', count: '2.1k+' },
    { name: 'Dogs', icon: '🐕', count: '450+' },
    { name: 'Cats', icon: '🐈', count: '320+' },
    { name: 'Others', icon: '🐾', count: '150+' },
  ];

  const featuredListings = [
    {
      id: 1,
      name: 'High-Yield Murrah Buffalo',
      price: '$2,400',
      location: 'Punjab, India',
      image: buffaloImg,
      category: 'Buffaloes',
      time: '2 hours ago'
    },
    {
      id: 2,
      name: 'Gir Cow - Pure Breed',
      price: '$1,850',
      location: 'Gujarat, India',
      image: heroImg, // Reusing hero image for variety if needed, but it looks like a cow
      category: 'Cows',
      time: '5 hours ago'
    },
    {
      id: 3,
      name: 'Golden Retriever Puppies',
      price: '$600',
      location: 'Delhi, India',
      image: dogImg,
      category: 'Dogs',
      time: '1 day ago'
    },
    {
      id: 4,
      name: 'Persian White Kitten',
      price: '$350',
      location: 'Mumbai, India',
      image: catImg,
      category: 'Cats',
      time: '3 hours ago'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-effect fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#2d5a27] p-2 rounded-lg">
              <ShoppingBag className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#2d5a27]">Cattle<span className="text-[#d4a373]">Trade</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="nav-link">Buy Cattle</a>
            <a href="#" className="nav-link">Sell Cattle</a>
            <a href="#" className="nav-link">Market Prices</a>
            <a href="#" className="nav-link">About Us</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 font-semibold text-[#2d5a27] hover:opacity-80 transition-opacity">
              <User size={20} />
              Login
            </button>
            <button className="btn-primary">
              <Plus size={20} />
              Post Ad
            </button>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden glass-effect absolute top-full left-0 w-full p-6 space-y-4 animate-fade-in">
            <a href="#" className="block nav-link">Buy Cattle</a>
            <a href="#" className="block nav-link">Sell Cattle</a>
            <a href="#" className="block nav-link">Market Prices</a>
            <a href="#" className="block nav-link">About Us</a>
            <hr className="border-[#eee]" />
            <button className="w-full flex items-center justify-center gap-2 font-semibold text-[#2d5a27] py-2">
              <User size={20} />
              Login
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Beautiful Cattle" 
            className="w-full h-full object-cover animate-fade-in"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-fade-in-up leading-tight">
            The World's Premium <br />
            <span className="text-[#d4a373]">Cattle Marketplace</span>
          </h1>
          <p className="text-xl text-white/90 mb-12 animate-fade-in-up delay-100 max-w-2xl mx-auto">
            Buy and sell cows, buffaloes, goats, and domestic pets with trust and transparency. 
            Verified sellers and premium livestock at your fingertips.
          </p>
        </div>
      </section>

      {/* Search Bar Container */}
      <div className="px-6 -mt-16">
        <div className="search-container animate-fade-in-up delay-200">
          <div className="flex-1 flex items-center gap-2 pl-4">
            <Search className="text-[#2d5a27] w-5 h-5" />
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              className="search-input"
            />
          </div>
          <div className="divider"></div>
          <div className="flex-1 flex items-center gap-2 px-4">
            <MapPin className="text-[#2d5a27] w-5 h-5" />
            <input 
              type="text" 
              placeholder="Select Location" 
              className="search-input"
            />
          </div>
          <button className="btn-primary !px-10 h-[56px]">
            Search Now
          </button>
        </div>
      </div>

      {/* Popular Categories */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Popular Categories</h2>
            <p className="text-[#666]">Explore cattle and pets by category</p>
          </div>
          <a href="#" className="text-[#2d5a27] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View All <ChevronRight size={20} />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="category-card bg-white p-6 rounded-[32px] text-center cursor-pointer border border-[#eee] hover:border-[#2d5a27] transition-all group">
              <div className="category-icon mx-auto mb-4 text-3xl group-hover:bg-[#2d5a27] group-hover:text-white">
                {cat.icon}
              </div>
              <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
              <p className="text-sm text-[#666]">{cat.count} listings</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Listings</h2>
              <p className="text-[#666]">Handpicked premium livestock for you</p>
            </div>
            <div className="flex gap-2">
              <button className="p-3 rounded-full border border-[#eee] hover:bg-[#f4f4f4] transition-colors">
                <ChevronRight className="rotate-180" />
              </button>
              <button className="p-3 rounded-full border border-[#eee] hover:bg-[#f4f4f4] transition-colors">
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredListings.map((item) => (
              <div key={item.id} className="premium-card group relative">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#2d5a27]">
                    {item.category}
                  </div>
                  <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full text-[#666] hover:text-red-500 transition-colors">
                    <Heart size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl group-hover:text-[#2d5a27] transition-colors">{item.name}</h3>
                    <span className="text-[#2d5a27] font-extrabold text-xl">{item.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#666] text-sm mb-4">
                    <MapPin size={14} />
                    {item.location}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#eee]">
                    <span className="text-xs text-[#999]">{item.time}</span>
                    <button className="text-[#2d5a27] font-bold text-sm flex items-center gap-1">
                      Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="premium-card bg-[#2d5a27] text-white p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#3a7532] skew-x-[-20deg] translate-x-1/2 opacity-50"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Trade with Us?</h2>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                We are India's most trusted platform for livestock and pet trading. 
                Experience a safe, fast, and transparent marketplace.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <ShieldCheck className="text-[#d4a373] w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Verified Sellers</h4>
                    <p className="text-sm text-white/60">Strict KYC verification</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <Zap className="text-[#d4a373] w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Fast Trading</h4>
                    <p className="text-sm text-white/60">Sell in under 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[40px] border border-white/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                  <div className="flex-1 h-4 bg-white/20 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="w-full h-32 bg-white/20 rounded-[30px]"></div>
                  <div className="w-3/4 h-4 bg-white/20 rounded-full"></div>
                  <div className="w-1/2 h-4 bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingBag className="text-[#d4a373] w-8 h-8" />
              <span className="text-3xl font-bold tracking-tight">Cattle<span className="text-[#d4a373]">Trade</span></span>
            </div>
            <p className="text-white/60 mb-8 max-w-sm leading-relaxed">
              Empowering farmers and animal lovers across the country with a premium, 
              secure, and easy-to-use trading platform.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#2d5a27] transition-colors"><Globe size={20} /></a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#2d5a27] transition-colors"><ShieldCheck size={20} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Browse Listings</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Market Statistics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Seller Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Tips</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/10 text-center text-white/40 text-sm">
          © 2026 CattleTrade Marketplace. All rights reserved. Made with ❤️ for farmers.
        </div>
        
        {/* Developer Debug Section */}
        <div className="max-w-7xl mx-auto mt-20 opacity-20 hover:opacity-100 transition-opacity">
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
            <h5 className="text-white font-mono mb-4 text-xs uppercase tracking-widest">Dev Debug Mode</h5>
            <APITester />
          </div>
        </div>
      </footer>
    </div>
  );
}

// export default App;
