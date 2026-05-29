"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Search, 
  Plus, 
  Heart, 
  User, 
  LogOut, 
  Loader2, 
  Sparkles, 
  X, 
  Info,
  Calendar,
  Weight,
  Phone,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { useLocationStore } from "@/store/locationStore";
import { useGetListedAnimalsByLocation } from "@/api/hooks/animal/listing";
import { useGetAllCategories } from "@/api/hooks/animal/category";
import { Category } from "@/types/animal-category";
import { formatPrice } from "@/utils/price";

// Mock Listings to act as Featured Recommendations so the page is populated with stunning images
const MOCK_LISTINGS = [
  {
    id: "mock-1",
    title: "High Milk Yielding Sahiwal Cow",
    description: "Healthy Sahiwal cow in her 2nd lactation period. Extremely docile temperament, yields 14 liters of milk daily. Regularly vaccinated and vet-checked. Ideal for dairy farming.",
    price: "55000",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    images: [
      {
        id: "img-1",
        url: { secure_url: "/cow_card.png" }
      }
    ],
    animal: {
      category: "COW",
      mainCategoryId: "cow-id-fallback",
      breed: "Sahiwal",
      ageMonths: 36,
      gender: "FEMALE",
      weightKg: 420,
      doesGiveMilk: true,
      dailyMilkProdLtr: 14,
      name: "Gauri"
    },
    location: {
      state: { name: "Maharashtra" },
      city: { name: "Pune" }
    }
  },
  {
    id: "mock-2",
    title: "Premium Grade Murrah Buffalo",
    description: "Pure Murrah breed, prime age, currently yielding 18 liters of milk daily. Robust body, excellent health, and dewormed. High fat content milk. Ready to transport.",
    price: "85000",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    images: [
      {
        id: "img-2",
        url: { secure_url: "/buffalo_card.png" }
      }
    ],
    animal: {
      category: "BUFFALO",
      mainCategoryId: "buffalo-id-fallback",
      breed: "Murrah",
      ageMonths: 48,
      gender: "FEMALE",
      weightKg: 580,
      doesGiveMilk: true,
      dailyMilkProdLtr: 18,
      name: "Kali"
    },
    location: {
      state: { name: "Haryana" },
      city: { name: "Rohtak" }
    }
  },
  {
    id: "mock-3",
    title: "Fluffy Show-Quality Persian Cat",
    description: "A super active and playful Persian cat. Gorgeous cream coat, crystal blue eyes. Fully dewormed, vaccinated, and litter trained. Extremely socialized with kids.",
    price: "15000",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    images: [
      {
        id: "img-3",
        url: { secure_url: "/cat_card.png" }
      }
    ],
    animal: {
      category: "CAT",
      mainCategoryId: "cat-id-fallback",
      breed: "Persian",
      ageMonths: 12,
      gender: "FEMALE",
      weightKg: 4,
      doesGiveMilk: false,
      dailyMilkProdLtr: null,
      name: "Milo"
    },
    location: {
      state: { name: "Delhi" },
      city: { name: "New Delhi" }
    }
  },
  {
    id: "mock-4",
    title: "Champion Line Golden Retriever Puppy",
    description: "Extremely active Golden Retriever puppy from KCI registered champion parents. Vet checked, vaccinated with card, very playful, friendly, and looking for a loving home.",
    price: "22000",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    images: [
      {
        id: "img-4",
        url: { secure_url: "/dog_card.png" }
      }
    ],
    animal: {
      category: "DOG",
      mainCategoryId: "dog-id-fallback",
      breed: "Golden Retriever",
      ageMonths: 3,
      gender: "MALE",
      weightKg: 12,
      doesGiveMilk: false,
      dailyMilkProdLtr: null,
      name: "Leo"
    },
    location: {
      state: { name: "Karnataka" },
      city: { name: "Bengaluru" }
    }
  }
];

const EMOJI_MAP: Record<string, string> = {
  cow: "🐄",
  buffalo: "🦬",
  cat: "🐱",
  dog: "🐶",
  goat: "🐐",
  sheep: "🐑",
  horse: "🐎",
  poultry: "🐔",
  rabbit: "🐇"
};

const COLOR_MAP: Record<string, { color: string; text: string }> = {
  cow: { color: "from-amber-500/10 to-amber-600/5 border-amber-500/10 hover:border-amber-500/30", text: "text-amber-600 dark:text-amber-400" },
  buffalo: { color: "from-zinc-500/10 to-zinc-600/5 border-zinc-500/10 hover:border-zinc-500/30", text: "text-zinc-600 dark:text-zinc-400" },
  cat: { color: "from-blue-500/10 to-blue-600/5 border-blue-500/10 hover:border-blue-500/30", text: "text-blue-600 dark:text-blue-400" },
  dog: { color: "from-orange-500/10 to-orange-600/5 border-orange-500/10 hover:border-orange-500/30", text: "text-orange-600 dark:text-orange-400" },
};

interface HomeClientProps {
  initialCategories: Category[];
}

export default function HomeClient({ initialCategories }: HomeClientProps) {
  const router = useRouter();
  const location = useLocationStore((state) => state.location);
  const clearLocation = useLocationStore((state) => state.clearLocation);
  
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Authenticate user check
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
      } else {
        setAuthLoading(false);
      }
    }
  }, [router]);

  // Fetch categories from API, utilizing the initialCategories as initialData
  const { data: categoriesResponse } = useGetAllCategories({
    enabled: !authLoading,
    initialData: {
      success: true,
      message: "Categories fetched",
      data: initialCategories
    }
  });
  const categoriesList = categoriesResponse?.data || [];

  // Parse location coordinates
  const lat = location?.latitude ? parseFloat(location.latitude) : 0;
  const lng = location?.longitude ? parseFloat(location.longitude) : 0;

  // Fetch local listings
  const { data: listingsResponse, isLoading: listingsLoading } = useGetListedAnimalsByLocation(
    { latitude: lat, longitude: lng, limit: 20, categoryId: selectedCategoryId || undefined },
    { enabled: !authLoading && !!lat && !!lng }
  );

  const localListings = listingsResponse?.data?.listings || [];

  // Combine and filter listings for search & category selection
  const filterListings = (listingsArray: any[], isLocalListings: boolean = false) => {
    return listingsArray.filter(item => {
      // Category filter (only client-side filter for featured/mock listings since local listings are filtered by categoryId on the server)
      if (selectedCategoryId && !isLocalListings) {
        const selectedCategory = categoriesList.find(c => c.id === selectedCategoryId);
        if (selectedCategory) {
          const itemCategory = item.animal.category?.toUpperCase() || "";
          const targetCategory = selectedCategory.name.toUpperCase();
          if (itemCategory !== targetCategory && !itemCategory.includes(targetCategory) && !targetCategory.includes(itemCategory)) {
            // Also check mainCategoryId
            if (item.animal.mainCategoryId !== selectedCategoryId) {
              return false;
            }
          }
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query) || false;
        const breedMatch = item.animal.breed?.toLowerCase().includes(query) || false;
        const breedCatMatch = item.animal.category?.toLowerCase().includes(query) || false;
        return titleMatch || descMatch || breedMatch || breedCatMatch;
      }

      return true;
    });
  };

  const filteredLocalListings = filterListings(localListings, true);
  const filteredFeaturedListings = filterListings(MOCK_LISTINGS, false);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      clearLocation();
      router.push("/auth");
    }
  };

  if (authLoading || !mounted) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin h-10 w-10 text-emerald-500 mb-4" />
        <p className="text-sm text-zinc-400 font-semibold tracking-wider uppercase">Loading PashuSetu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors duration-300 font-sans">
      
      {/* 1. PROFESSIONAL NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo/logo.png" alt="PashuSetu Logo" className="h-14 w-auto object-contain hidden sm:block" />
            <img src="/logo/mobile-logo.png" alt="PashuSetu Logo" className="h-10 w-auto object-contain sm:hidden" />
          </Link>

          {/* Location Selector (OLX Professional Style) */}
          <div className="flex items-center max-w-xs md:max-w-sm">
            <Link 
              href="/select-location" 
              className="flex items-center gap-2 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all duration-200 group text-left cursor-pointer"
            >
              <div className="p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
                <MapPin className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="overflow-hidden pr-2">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider leading-none">Location</p>
                <p className="text-xs md:text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate mt-0.5 max-w-[110px] sm:max-w-[150px]">
                  {location ? `${location.city}, ${location.state}` : "Select Location"}
                </p>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search cows, buffaloes, breeds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500/50 rounded-xl outline-none text-sm transition-all font-medium placeholder:text-zinc-500"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Sell Button */}
            <Link
              href="/pashu-listing"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-emerald-500/10 shadow-black/5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="h-4 w-4 stroke-3" />
              <span>SELL</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-500/5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-500/10"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pt-4 pb-1 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search cows, buffaloes, breeds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm font-medium placeholder:text-zinc-500"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      {/* 2. HERO / BANNER SECTION */}
      <section className="relative w-full overflow-hidden select-none bg-zinc-900 text-white">
        {/* Farm Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/login/cows.png" 
            alt="Cows farm" 
            className="w-full h-full object-cover opacity-35 scale-105 filter blur-xs"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-900/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>The Premier Livestock Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            India's Leading Animal & Cattle <span className="text-emerald-500">OLX Marketplace</span>
          </h1>
          
          <p className="mt-4 text-sm sm:text-lg text-zinc-300 max-w-xl font-medium">
            Buy and sell cows, buffaloes, pets, and accessories in your local neighborhood with full transparency.
          </p>

          {!location && (
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/select-location"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 cursor-pointer"
              >
                <span>Select Your Location to Browse Nearby</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3. CATEGORIES FILTERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 uppercase flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-600 rounded-full" />
              Browse by Category
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Select an animal type to filter listings</p>
          </div>
          {selectedCategoryId && (
            <button
              onClick={() => setSelectedCategoryId(null)}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" /> Clear Filter
            </button>
          )}
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 snap-x snap-mandatory">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const emoji = EMOJI_MAP[cat.name.toLowerCase()] || "🐾";
            const style = COLOR_MAP[cat.name.toLowerCase()] || {
              color: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/10 hover:border-emerald-500/30",
              text: "text-emerald-600 dark:text-emerald-400"
            };
            const imageSecUrl = (cat.imageUrl as any)?.secure_url || (cat.imageUrl as any)?.url;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(prev => prev === cat.id ? null : cat.id)}
                className={`flex flex-col items-center justify-center p-6 min-w-[140px] bg-linear-to-br border rounded-2xl transition-all duration-300 group cursor-pointer snap-start ${
                  isSelected 
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20" 
                    : `${style.color} bg-white dark:bg-zinc-950`
                }`}
              >
                {imageSecUrl ? (
                  <img src={imageSecUrl} alt={cat.name} className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{emoji}</span>
                )}
                <span className={`mt-3 text-xs sm:text-sm font-bold tracking-wide uppercase truncate max-w-[120px] ${isSelected ? "text-emerald-600 dark:text-emerald-400" : style.text}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. DYNAMIC LISTINGS SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full flex-1 flex flex-col gap-12">
        
        {/* Recommendations based on selected location */}
        {location && (
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 uppercase flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                  Recommendations Near {location.city}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Showing livestock listings posted near your coordinates</p>
              </div>
            </div>

            {listingsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-emerald-500" />
              </div>
            ) : filteredLocalListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredLocalListings.map((item) => (
                  <ListingCard key={item.id} item={item} onClick={() => router.push(`/listing/${item.id}`)} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-8 text-center flex flex-col items-center max-w-md mx-auto">
                <div className="p-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 rounded-full mb-4">
                  <Info className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-zinc-800 dark:text-zinc-200">No Listings in this Category nearby</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                  Try clearing the category filter or search query. If you own animals, list them to display here!
                </p>
                <Link
                  href="/pashu-listing"
                  className="mt-5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Post an Ad
                </Link>
              </div>
            )}
          </section>
        )}

        {/* FEATURED / RECOMMENDATIONS SECTION (Fallback & Demo Listings) */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 uppercase flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                Featured Classifieds
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Trending premium postings across India</p>
            </div>
          </div>

          {filteredFeaturedListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredFeaturedListings.map((item) => (
                <ListingCard key={item.id} item={item} onClick={() => router.push(`/listing/${item.id}`)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-400">
              No matching featured listings found.
            </div>
          )}
        </section>

      </main>

      {/* 5. FOOTER */}
      <footer className="w-full bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <img src="/logo/logo.png" alt="PashuSetu Logo" className="h-10 w-auto object-contain opacity-75" />
            <span>© {new Date().getFullYear()} PashuSetu Classifieds</span>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-emerald-500 transition-colors">About Us</Link>
            <Link href="/pashu-listing" className="hover:text-emerald-500 transition-colors">List Livestock</Link>
            <Link href="/select-location" className="hover:text-emerald-500 transition-colors">Select Location</Link>
          </div>
        </div>
      </footer>



    </div>
  );
}

// Listing Card Component
function ListingCard({ item, onClick }: { item: any; onClick: () => void }) {
  const imageUrl = item.images[0]?.url?.secure_url || "/cow_card.png";
  const priceFormatted = formatPrice(item.price);
  
  // Date rendering
  const daysAgo = Math.floor((Date.now() - new Date(item.createdAt).getTime()) / 86400000);
  const dateText = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-emerald-950/15 hover:border-emerald-500/20 transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Image container */}
      <div className="w-full aspect-4/3 bg-zinc-100 dark:bg-zinc-900 relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        {/* Category tag */}
        <div className="absolute top-3 left-3 bg-black/60 dark:bg-zinc-950/70 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
          <span>{item.animal.category}</span>
          {item.animal.breed && (
            <>
              <span className="text-zinc-400 font-normal">•</span>
              <span className="text-emerald-400">{item.animal.breed}</span>
            </>
          )}
        </div>
        {/* Favorite icon */}
        <button 
          onClick={(e) => { e.stopPropagation(); }} 
          className="absolute top-3 right-3 p-2 bg-white/70 dark:bg-zinc-900/70 hover:bg-white dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:text-rose-500 backdrop-blur-xs rounded-full border border-white/10 transition-colors cursor-pointer"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 tracking-tight leading-none">
            ₹{priceFormatted}
          </p>
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 leading-tight line-clamp-2 mt-1">
            {item.title}
          </h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5 font-medium">
            {item.animal.gender || "N/A"} • {item.animal.ageMonths ? `${item.animal.ageMonths} mo` : "Age N/A"}
            {item.animal.weightKg ? ` • ${item.animal.weightKg} kg` : ""}
            {item.animal.doesGiveMilk && item.animal.dailyMilkProdLtr ? ` • ${item.animal.dailyMilkProdLtr} L/day` : ""}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 pt-2.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider shrink-0 mt-1">
          <span className="flex items-center gap-1 max-w-[120px] truncate">
            <MapPin className="h-3 w-3 text-zinc-400 shrink-0" />
            <span className="truncate">{item.location.city.name}</span>
          </span>
          <span>{dateText}</span>
        </div>
      </div>
    </div>
  );
}

// Animal Detail Modal
function DetailModal({ item, onClose }: { item: any; onClose: () => void }) {
  const imageUrl = item.images[0]?.url?.secure_url || "/cow_card.png";
  const priceFormatted = formatPrice(item.price);
  
  // Date rendering
  const daysAgo = Math.floor((Date.now() - new Date(item.createdAt).getTime()) / 86400000);
  const dateText = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;

  const [showPhone, setShowPhone] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-y-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute z-10 top-4 right-4 p-2.5 bg-black/60 hover:bg-black text-white hover:text-rose-400 backdrop-blur-md rounded-full border border-white/10 transition-all cursor-pointer shadow-md"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left/Top: Image & Description */}
        <div className="w-full md:w-[55%] flex flex-col bg-zinc-100 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-900">
          <div className="w-full aspect-4/3 relative">
            <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 bg-black/60 text-[10px] font-bold text-white uppercase tracking-wider px-3 py-1 rounded-full border border-white/10">
              {item.animal.category}
            </div>
          </div>
          <div className="p-6 overflow-y-auto max-h-[30vh] md:max-h-[350px]">
            <h4 className="text-xs uppercase font-extrabold text-zinc-500 tracking-wider">Description</h4>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-semibold">
              {item.description}
            </p>
          </div>
        </div>

        {/* Right/Bottom: Attributes & Actions */}
        <div className="w-full md:w-[45%] p-6 md:p-8 flex flex-col justify-between gap-6 overflow-y-auto max-h-[60vh] md:max-h-[600px]">
          
          <div className="flex flex-col gap-4">
            {/* Title / Price */}
            <div className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-900 pb-4">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{item.location.city.name}, {item.location.state.name} • {dateText}</span>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug mt-1">
                {item.title}
              </h2>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mt-1.5">
                ₹{priceFormatted}
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs uppercase font-extrabold text-zinc-500 tracking-wider mb-1">Overview / Specifications</h4>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Breed", value: item.animal.breed || "N/A", icon: <Sparkles className="h-4 w-4 text-emerald-500" /> },
                  { label: "Age", value: item.animal.ageMonths ? `${item.animal.ageMonths} Months` : "N/A", icon: <Calendar className="h-4 w-4 text-emerald-500" /> },
                  { label: "Gender", value: item.animal.gender || "N/A", icon: <User className="h-4 w-4 text-emerald-500" /> },
                  { label: "Weight", value: item.animal.weightKg ? `${item.animal.weightKg} Kg` : "N/A", icon: <Weight className="h-4 w-4 text-emerald-500" /> },
                  { label: "Milking", value: item.animal.doesGiveMilk ? "Yes" : "No", icon: <TrendingUp className="h-4 w-4 text-emerald-500" /> },
                  { label: "Milk Capacity", value: item.animal.doesGiveMilk && item.animal.dailyMilkProdLtr ? `${item.animal.dailyMilkProdLtr} Ltr/Day` : "N/A", icon: <Sparkles className="h-4 w-4 text-emerald-500" /> },
                ].map((spec, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 rounded-xl">
                    <div className="shrink-0">{spec.icon}</div>
                    <div>
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider leading-none">{spec.label}</p>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-1 leading-none">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider leading-none">Seller Details</p>
                <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 mt-1 leading-none">
                  {item.animal.name ? `${item.animal.name}'s Owner` : "Cattle Owner"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPhone(true)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-emerald-600/10"
            >
              <Phone className="h-4.5 w-4.5" />
              {showPhone ? (
                <span>+91 98765 43210</span>
              ) : (
                <span>CONTACT SELLER</span>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
