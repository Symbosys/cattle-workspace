"use client";

import { useGetAnimalListingById } from "@/api/hooks/animal/listing";
import { formatPrice } from "@/utils/price";
import {
  ArrowLeft,
  Calendar,
  Loader2,
  MapPin,
  Phone,
  Sparkles,
  TrendingUp,
  User,
  Weight,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

// Mock Listings to act as Featured Recommendations so the page is populated with stunning images
const MOCK_LISTINGS = [
  {
    id: "mock-1",
    title: "High Milk Yielding Sahiwal Cow",
    description:
      "Healthy Sahiwal cow in her 2nd lactation period. Extremely docile temperament, yields 14 liters of milk daily. Regularly vaccinated and vet-checked. Ideal for dairy farming.",
    price: "55000",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    images: [
      {
        id: "img-1",
        url: { secure_url: "/cow_card.png" },
      },
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
      name: "Gauri",
    },
    location: {
      state: { name: "Maharashtra" },
      city: { name: "Pune" },
    },
    owner: {
      id: "owner-1",
      name: "Ramesh Kumar",
      phone: "+91 98765 43210",
    },
  },
  {
    id: "mock-2",
    title: "Premium Grade Murrah Buffalo",
    description:
      "Pure Murrah breed, prime age, currently yielding 18 liters of milk daily. Robust body, excellent health, and dewormed. High fat content milk. Ready to transport.",
    price: "85000",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    images: [
      {
        id: "img-2",
        url: { secure_url: "/buffalo_card.png" },
      },
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
      name: "Kali",
    },
    location: {
      state: { name: "Haryana" },
      city: { name: "Rohtak" },
    },
    owner: {
      id: "owner-2",
      name: "Suresh Singh",
      phone: "+91 98765 43211",
    },
  },
  {
    id: "mock-3",
    title: "Fluffy Show-Quality Persian Cat",
    description:
      "A super active and playful Persian cat. Gorgeous cream coat, crystal blue eyes. Fully dewormed, vaccinated, and litter training. Extremely socialized with kids.",
    price: "15000",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    images: [
      {
        id: "img-3",
        url: { secure_url: "/cat_card.png" },
      },
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
      name: "Milo",
    },
    location: {
      state: { name: "Delhi" },
      city: { name: "New Delhi" },
    },
    owner: {
      id: "owner-3",
      name: "Anjali Sharma",
      phone: "+91 98765 43212",
    },
  },
  {
    id: "mock-4",
    title: "Champion Line Golden Retriever Puppy",
    description:
      "Extremely active Golden Retriever puppy from KCI registered champion parents. Vet checked, vaccinated with card, very playful, friendly, and looking for a loving home.",
    price: "22000",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    images: [
      {
        id: "img-4",
        url: { secure_url: "/dog_card.png" },
      },
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
      name: "Leo",
    },
    location: {
      state: { name: "Karnataka" },
      city: { name: "Bengaluru" },
    },
    owner: {
      id: "owner-4",
      name: "Vikram Reddy",
      phone: "+91 98765 43213",
    },
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ListingDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [showPhone, setShowPhone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMock = id.startsWith("mock-");
  const mockItem = isMock ? MOCK_LISTINGS.find((item) => item.id === id) : null;

  const {
    data: response,
    isLoading,
    isError,
  } = useGetAnimalListingById(id, {
    enabled: !isMock && !!id,
  });

  const item = isMock ? mockItem : response?.data;

  if (!mounted) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin h-10 w-10 text-emerald-500 mb-4" />
        <p className="text-sm text-zinc-400 font-semibold tracking-wider uppercase">
          Loading Details...
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin h-10 w-10 text-emerald-500 mb-4" />
        <p className="text-sm text-zinc-400 font-semibold tracking-wider uppercase">
          Fetching Cattle Details...
        </p>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center flex flex-col items-center shadow-xl">
          <div className="p-4 bg-rose-500/10 text-rose-500 rounded-full mb-4">
            <X className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100">
            Cattle listing not found
          </h3>
          <p className="text-xs text-zinc-400 mt-2">
            The cattle listing you are looking for does not exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = item.images[0]?.url?.secure_url || "/cow_card.png";
  const priceFormatted = formatPrice(item.price);

  // Date rendering
  const daysAgo = Math.floor(
    (Date.now() - new Date(item.createdAt).getTime()) / 86400000,
  );
  const dateText =
    daysAgo === 0
      ? "Today"
      : daysAgo === 1
        ? "Yesterday"
        : `${daysAgo} days ago`;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      {/* 1. PROFESSIONAL NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all duration-200 group text-sm font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
          >
            <ArrowLeft className="h-4.5 w-4.5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center">
            <img
              src="/logo/logo.png"
              alt="PashuSetu Logo"
              className="h-14 w-auto object-contain hidden sm:block"
            />
          </div>
          <div className="w-[120px] sm:w-[150px]"></div>{" "}
          {/* spacer to center logo */}
        </div>
      </header>

      {/* 2. MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start">
          {/* Left Column: Image & Description */}
          <div className="w-full lg:w-[58%] flex flex-col gap-6">
            {/* Image Box */}
            <div className="w-full aspect-16/10 bg-zinc-100 dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 relative shadow-md">
              <img
                src={imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                <span>{item.animal.category}</span>
                {item.animal.breed && (
                  <>
                    <span className="text-zinc-400 font-normal">•</span>
                    <span className="text-emerald-400">
                      {item.animal.breed}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description Box */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm">
              <h4 className="text-xs uppercase font-extrabold text-zinc-500 tracking-wider">
                Description
              </h4>
              <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium whitespace-pre-line">
                {item.description}
              </p>
            </div>
          </div>

          {/* Right Column: Title, Specifications, Seller Info */}
          <div className="w-full lg:w-[42%] flex flex-col gap-6 sticky lg:top-24">
            {/* Title / Price Card */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-zinc-400 shrink-0" />
                  {item.location.city.name}, {item.location.state.name} •{" "}
                  {dateText}
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border border-emerald-500/10">
                  Active
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 leading-snug tracking-tight">
                {item.title}
              </h2>

              <div className="flex items-baseline gap-1 mt-1 border-t border-zinc-100 dark:border-zinc-900 pt-4">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  ₹{priceFormatted}
                </span>
              </div>
            </div>

            {/* Specifications Card */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-4">
              <h4 className="text-xs uppercase font-extrabold text-zinc-500 tracking-wider">
                Specifications
              </h4>

              <div className="grid grid-cols-2 gap-3 mt-2">
                {[
                  {
                    label: "Breed",
                    value: item.animal.breed || "N/A",
                    icon: <Sparkles className="h-4 w-4 text-emerald-500" />,
                  },
                  {
                    label: "Age",
                    value: item.animal.ageMonths
                      ? `${item.animal.ageMonths} Months`
                      : "N/A",
                    icon: <Calendar className="h-4 w-4 text-emerald-500" />,
                  },
                  {
                    label: "Gender",
                    value: item.animal.gender || "N/A",
                    icon: <User className="h-4 w-4 text-emerald-500" />,
                  },
                  {
                    label: "Weight",
                    value: item.animal.weightKg
                      ? `${item.animal.weightKg} Kg`
                      : "N/A",
                    icon: <Weight className="h-4 w-4 text-emerald-500" />,
                  },
                  {
                    label: "Milking",
                    value: item.animal.doesGiveMilk ? "Yes" : "No",
                    icon: <TrendingUp className="h-4 w-4 text-emerald-500" />,
                  },
                  {
                    label: "Milk Capacity",
                    value:
                      item.animal.doesGiveMilk && item.animal.dailyMilkProdLtr
                        ? `${item.animal.dailyMilkProdLtr} Ltr/Day`
                        : "N/A",
                    icon: <Sparkles className="h-4 w-4 text-emerald-500" />,
                  },
                ].map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 rounded-xl transition-all hover:border-emerald-500/10"
                  >
                    <div className="shrink-0 p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                      {spec.icon}
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider leading-none">
                        {spec.label}
                      </p>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-1 leading-none">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Box / Seller Details */}
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6 md:p-8 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider leading-none">
                    Seller Details
                  </p>
                  <p className="text-base font-black text-zinc-900 dark:text-zinc-100 mt-1 leading-none">
                    {item.owner?.name ||
                      (item.animal.name
                        ? `${item.animal.name}'s Owner`
                        : "Cattle Owner")}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPhone(true)}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-emerald-600/10 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Phone className="h-4.5 w-4.5" />
                {showPhone ? (
                  <span>{item.owner?.phone || "+91 98765 43210"}</span>
                ) : (
                  <span>CONTACT SELLER</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}