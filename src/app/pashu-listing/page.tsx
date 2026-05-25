"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { State, City } from "country-state-city";
import { useGetAllCategories } from "@/api/hooks/animal/category";
import { useCreateAnimalListing } from "@/api/hooks/animal/listing";

export default function PashuListingPage() {
  const router = useRouter();

  // Authentication & Loading states
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  // Details State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [listingDescription, setListingDescription] = useState("");
  const [animalName, setAnimalName] = useState("");
  const [breed, setBreed] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "">("");
  const [weightKg, setWeightKg] = useState("");
  const [doesGiveMilk, setDoesGiveMilk] = useState(false);
  const [dailyMilkProdLtr, setDailyMilkProdLtr] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Location State
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [selectedState, setSelectedState] = useState<{ name: string; isoCode: string; latitude?: string; longitude?: string } | null>(null);
  const [selectedCity, setSelectedCity] = useState<{ name: string; latitude?: string; longitude?: string } | null>(null);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const stateRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const { data: categoriesResponse, isLoading: categoriesLoading } = useGetAllCategories();
  const createListingMutation = useCreateAnimalListing();

  // Check auth on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
      } else {
        setLoadingAuth(false);
      }
    }
  }, [router]);

  // Click outside handling for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setStateDropdownOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  // Fetch Category lists
  const categories = categoriesResponse?.data || [];
  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);
  const subCategories = activeCategoryObj?.subCategories || [];

  // Fetch States & Cities list (specifically for India "IN")
  const statesList = State.getStatesOfCountry("IN");
  const filteredStates = statesList.filter((s) =>
    s.name.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const citiesList = selectedState
    ? City.getCitiesOfState("IN", selectedState.isoCode)
    : [];
  const filteredCities = citiesList.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Limit to max 10 files
      const newFiles = [...imageFiles, ...filesArray].slice(0, 10);
      setImageFiles(newFiles);

      // Generate previews
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    const nextFiles = [...imageFiles];
    nextFiles.splice(index, 1);
    setImageFiles(nextFiles);

    const nextPreviews = [...imagePreviews];
    URL.revokeObjectURL(nextPreviews[index]);
    nextPreviews.splice(index, 1);
    setImagePreviews(nextPreviews);
  };

  // Stepper Nav Actions
  const nextStep = () => {
    setError(null);
    if (step === 1) {
      if (!selectedCategory || !selectedSubCategory) {
        setError("Please select both category and subcategory");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!title.trim() || !price || !listingDescription.trim()) {
        setError("Title, Price and Description are required");
        return;
      }
      setStep(3);
    }
  };

  const prevStep = () => {
    setError(null);
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedState || !selectedCity) {
      setError("Please select state and city for the cattle location");
      return;
    }

    const mainCategoryName = activeCategoryObj?.name || "COW";

    createListingMutation.mutate(
      {
        mainCategoryId: selectedCategory!,
        subCategoryId: selectedSubCategory!,
        category: mainCategoryName,
        name: animalName || null,
        breed: breed || null,
        ageMonths: ageMonths ? parseInt(ageMonths, 10) : null,
        gender: gender || null,
        weightKg: weightKg ? parseFloat(weightKg) : null,
        description: listingDescription,
        doesGiveMilk: doesGiveMilk,
        dailyMilkProdLtr: dailyMilkProdLtr ? parseFloat(dailyMilkProdLtr) : null,
        title: title,
        price: parseFloat(price),
        listingDescription: listingDescription,
        stateName: selectedState.name,
        stateCode: selectedState.isoCode,
        stateLatitude: selectedState.latitude ? parseFloat(selectedState.latitude) : null,
        stateLongitude: selectedState.longitude ? parseFloat(selectedState.longitude) : null,
        cityName: selectedCity.name,
        cityLatitude: selectedCity.latitude ? parseFloat(selectedCity.latitude) : null,
        cityLongitude: selectedCity.longitude ? parseFloat(selectedCity.longitude) : null,
        images: imageFiles,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          // setTimeout(() => {
          //   router.push("/");
          // }, 3000);
        },
        onError: (err: any) => {
          const apiError = err.response?.data?.message || err.message || "Failed to list cattle";
          setError(apiError);
        },
      }
    );
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
        <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-start p-4 sm:p-6 md:p-10 font-sans">
      
      {/* Dynamic Submit Success Overlay */}
      {success && (
        <div className="fixed inset-0 bg-background/95 flex flex-col items-center justify-center z-50 transition-all duration-500 animate-in fade-in">
          <div className="flex flex-col items-center gap-6 max-w-sm text-center px-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary animate-bounce shadow-[0_0_40px_rgba(76,175,80,0.2)]">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-foreground">Cattle Listed Successfully!</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your cattle listing has been published. Redirecting to home page...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-3xl flex flex-col gap-8">
        
        {/* Header Block */}
        <div className="flex flex-col items-center text-center gap-1">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            List Your Cattle for Sale
          </h1>
          <p className="text-sm text-muted-foreground max-w-md">
            Publish your animal details and location to connect with potential buyers.
          </p>
        </div>

        {/* Stepper Steps UI */}
        <div className="relative flex items-center justify-between max-w-lg mx-auto w-full px-4 select-none">
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                step >= 1
                  ? "bg-primary border-primary text-primary-foreground shadow-[0_0_20px_rgba(76,175,80,0.3)]"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              1
            </div>
            <span className={`text-[11px] font-bold tracking-wider ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
              Category
            </span>
          </div>

          {/* Line between 1 & 2 */}
          <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${step >= 2 ? "bg-primary" : "bg-border"}`} />

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                step >= 2
                  ? "bg-primary border-primary text-primary-foreground shadow-[0_0_20px_rgba(76,175,80,0.3)]"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              2
            </div>
            <span className={`text-[11px] font-bold tracking-wider ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
              Details
            </span>
          </div>

          {/* Line between 2 & 3 */}
          <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${step >= 3 ? "bg-primary" : "bg-border"}`} />

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                step >= 3
                  ? "bg-primary border-primary text-primary-foreground shadow-[0_0_20px_rgba(76,175,80,0.3)]"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              3
            </div>
            <span className={`text-[11px] font-bold tracking-wider ${step >= 3 ? "text-foreground" : "text-muted-foreground"}`}>
              Location
            </span>
          </div>
        </div>

        {/* Dynamic Warning Alert Banner */}
        {error && (
          <div className="flex items-start gap-3 text-sm text-rose-500 bg-rose-500/5 border border-rose-500/10 p-4 rounded-xl max-w-xl mx-auto w-full animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold">Action Failed</span>
              <span className="text-xs text-rose-500/90 leading-relaxed font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Stepper Card container */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.4)] transition-all duration-300">
          
          {/* STEP 1: CATEGORY SELECTION */}
          {step === 1 && (
            <div className="flex flex-col gap-8 animate-in fade-in duration-300">
              
              {/* Main Categories Section */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-bold text-foreground tracking-tight">1. Select Cattle Category</h2>
                  <p className="text-xs text-muted-foreground">Select the primary category of the cattle you want to list.</p>
                </div>

                {categoriesLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Array(4).fill(0).map((_, i) => (
                      <div key={i} className="aspect-square bg-muted/40 animate-pulse rounded-xl border border-border/50" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {categories.map((cat) => {
                      const isActive = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setSelectedSubCategory(null); // Reset subcategory when category changes
                          }}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 bg-background/40 hover:bg-muted/10 cursor-pointer transition-all duration-300 gap-3 text-center ${
                            isActive
                              ? "border-primary bg-primary/5 text-foreground shadow-[0_0_15px_rgba(76,175,80,0.1)]"
                              : "border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {cat.imageUrl && typeof cat.imageUrl === "object" && "secure_url" in cat.imageUrl ? (
                            <img
                              src={(cat.imageUrl as any).secure_url}
                              alt={cat.name}
                              className="w-12 h-12 object-contain rounded-lg"
                            />
                          ) : (
                            <span className="text-3xl">🐄</span>
                          )}
                          <span className="text-xs font-bold uppercase tracking-wider">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sub Categories Section */}
              {selectedCategory && (
                <div className="flex flex-col gap-4 border-t border-border pt-6 animate-in fade-in slide-in-from-top-3 duration-300">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold text-foreground tracking-tight">2. Select Breed / Subcategory</h2>
                    <p className="text-xs text-muted-foreground">Select the specific type or subcategory breed.</p>
                  </div>

                  {subCategories.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No breeds available for this category.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {subCategories.map((sub) => {
                        const isActive = selectedSubCategory === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => setSelectedSubCategory(sub.id)}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 bg-background/40 hover:bg-muted/10 cursor-pointer transition-all duration-300 gap-3 text-center ${
                              isActive
                                ? "border-primary bg-primary/5 text-foreground shadow-[0_0_15px_rgba(76,175,80,0.1)]"
                                : "border-border text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {sub.imageUrl && typeof sub.imageUrl === "object" && "secure_url" in sub.imageUrl ? (
                              <img
                                src={(sub.imageUrl as any).secure_url}
                                alt={sub.name}
                                className="w-12 h-12 object-contain rounded-lg"
                              />
                            ) : (
                              <span className="text-2xl">🌱</span>
                            )}
                            <span className="text-xs font-bold">{sub.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Step Navigation */}
              <div className="flex justify-end pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!selectedCategory || !selectedSubCategory}
                  className="px-6 py-3 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed uppercase tracking-wider flex items-center gap-2 shadow-md"
                >
                  <span>Continue</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: DETAILS FORM */}
          {step === 2 && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              
              <div className="flex flex-col gap-1 pb-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Cattle & Listing Details</h2>
                <p className="text-xs text-muted-foreground">Provide full information and upload clear photos of your animal.</p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Title */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label htmlFor="title" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Listing Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Pure Sahiwal Cow - High Yielding 15 Liters/Day"
                    className="w-full px-4 py-3 bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/5 rounded-lg outline-none text-sm transition-all"
                  />
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="price" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Price (INR) *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-muted-foreground text-sm font-semibold select-none">₹</span>
                    <input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g., 65000"
                      className="w-full pl-8 pr-4 py-3 bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/5 rounded-lg outline-none text-sm transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Breed */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="breed" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Breed
                  </label>
                  <input
                    id="breed"
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="e.g., Sahiwal, Gir, Murrah"
                    className="w-full px-4 py-3 bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/5 rounded-lg outline-none text-sm transition-all"
                  />
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="animalName" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Animal Name (Optional)
                  </label>
                  <input
                    id="animalName"
                    type="text"
                    value={animalName}
                    onChange={(e) => setAnimalName(e.target.value)}
                    placeholder="e.g., Ganga, Lakshmi"
                    className="w-full px-4 py-3 bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/5 rounded-lg outline-none text-sm transition-all"
                  />
                </div>

                {/* Gender selection */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Gender
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setGender("FEMALE")}
                      className={`py-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        gender === "FEMALE"
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-background hover:bg-muted/10 text-muted-foreground"
                      }`}
                    >
                      FEMALE
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("MALE")}
                      className={`py-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        gender === "MALE"
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-background hover:bg-muted/10 text-muted-foreground"
                      }`}
                    >
                      MALE
                    </button>
                  </div>
                </div>

                {/* Age Months */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ageMonths" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Age (In Months)
                  </label>
                  <input
                    id="ageMonths"
                    type="number"
                    value={ageMonths}
                    onChange={(e) => setAgeMonths(e.target.value)}
                    placeholder="e.g., 36"
                    className="w-full px-4 py-3 bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/5 rounded-lg outline-none text-sm transition-all font-mono"
                  />
                </div>

                {/* Weight Kg */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="weightKg" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Weight (In Kg)
                  </label>
                  <input
                    id="weightKg"
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="e.g., 380"
                    className="w-full px-4 py-3 bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/5 rounded-lg outline-none text-sm transition-all font-mono"
                  />
                </div>

                {/* Milk Yield Section */}
                <div className="flex flex-col gap-4 bg-muted/20 border border-border/80 p-4 rounded-xl md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold tracking-wider text-foreground uppercase">Milk Yield Details</span>
                      <span className="text-[10px] text-muted-foreground">Toggle this if your animal is currently giving milk.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDoesGiveMilk(!doesGiveMilk)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        doesGiveMilk ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                          doesGiveMilk ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {doesGiveMilk && (
                    <div className="flex flex-col gap-1.5 animate-in fade-in duration-300">
                      <label htmlFor="dailyMilkProdLtr" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                        Daily Milk Production (Liters)
                      </label>
                      <input
                        id="dailyMilkProdLtr"
                        type="number"
                        step="0.1"
                        value={dailyMilkProdLtr}
                        onChange={(e) => setDailyMilkProdLtr(e.target.value)}
                        placeholder="e.g., 14.5"
                        className="w-full px-4 py-3 bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/5 rounded-lg outline-none text-sm transition-all font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Listing Description */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label htmlFor="listingDescription" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Description *
                  </label>
                  <textarea
                    id="listingDescription"
                    rows={4}
                    value={listingDescription}
                    onChange={(e) => setListingDescription(e.target.value)}
                    placeholder="Provide detailed description of your animal. Highlight health conditions, pregnancy history, lactation yields, temperament, and vaccination status."
                    className="w-full px-4 py-3 bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/5 rounded-lg outline-none text-sm transition-all resize-none"
                  />
                </div>

                {/* Image Upload Zone */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Upload Photos (Max 10)
                  </span>
                  
                  {/* Dropzone Container */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border hover:border-primary/40 rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-background/20 select-none text-center"
                  >
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-semibold">Click to select files</span>
                    <span className="text-[10px] text-muted-foreground">Supports JPEG, PNG, JPG, WEBP (Max 2MB per file)</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Image Thumbnails Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                          <img src={preview} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm text-foreground text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Step Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-border hover:bg-muted/40 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 select-none"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!title.trim() || !price || !listingDescription.trim()}
                  className="px-6 py-3 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed uppercase tracking-wider flex items-center gap-2 shadow-md"
                >
                  <span>Continue</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: LOCATION SELECTION */}
          {step === 3 && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              
              <div className="flex flex-col gap-1 pb-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Select Location</h2>
                <p className="text-xs text-muted-foreground">Select the state and city where the animal is located.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6">
                
                {/* State Autocomplete Input */}
                <div ref={stateRef} className="relative flex flex-col gap-1.5">
                  <label htmlFor="stateInput" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    State *
                  </label>
                  
                  <div className="relative">
                    <input
                      id="stateInput"
                      type="text"
                      value={stateSearch}
                      onChange={(e) => {
                        setStateSearch(e.target.value);
                        setStateDropdownOpen(true);
                      }}
                      onFocus={() => setStateDropdownOpen(true)}
                      placeholder={selectedState ? selectedState.name : "Search & Select State"}
                      className="w-full px-4 py-3 bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/5 rounded-lg outline-none text-sm transition-all"
                    />
                    
                    {/* Clear selection */}
                    {selectedState && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedState(null);
                          setSelectedCity(null);
                          setStateSearch("");
                          setCitySearch("");
                        }}
                        className="absolute right-3.5 top-3.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* State Dropdown List */}
                  {stateDropdownOpen && (
                    <div className="absolute top-[72px] left-0 right-0 max-h-56 overflow-y-auto bg-[#0a0a0a] border border-border rounded-xl shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      {filteredStates.length === 0 ? (
                        <div className="p-3.5 text-xs text-muted-foreground text-center">No states found</div>
                      ) : (
                        filteredStates.map((s) => (
                          <button
                            key={s.isoCode}
                            type="button"
                            onClick={() => {
                              setSelectedState({
                                name: s.name,
                                isoCode: s.isoCode,
                                latitude: s.latitude || "",
                                longitude: s.longitude || "",
                              });
                              setStateSearch(s.name);
                              setStateDropdownOpen(false);
                              setSelectedCity(null);
                              setCitySearch("");
                            }}
                            className="w-full text-left px-4 py-3 text-xs text-muted-foreground hover:text-foreground hover:bg-primary/5 border-b border-border/40 last:border-b-0 cursor-pointer font-medium"
                          >
                            {s.name}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* City Autocomplete Input */}
                <div ref={cityRef} className="relative flex flex-col gap-1.5">
                  <label htmlFor="cityInput" className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    City *
                  </label>

                  <div className="relative">
                    <input
                      id="cityInput"
                      type="text"
                      value={citySearch}
                      onChange={(e) => {
                        setCitySearch(e.target.value);
                        setCityDropdownOpen(true);
                      }}
                      onFocus={() => setCityDropdownOpen(true)}
                      disabled={!selectedState}
                      placeholder={
                        !selectedState
                          ? "Select a State First"
                          : selectedCity
                          ? selectedCity.name
                          : "Search & Select City"
                      }
                      className="w-full px-4 py-3 bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/5 rounded-lg outline-none text-sm transition-all disabled:bg-muted/10 disabled:border-border/50 disabled:text-muted-foreground/60 disabled:cursor-not-allowed"
                    />

                    {selectedCity && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCity(null);
                          setCitySearch("");
                        }}
                        className="absolute right-3.5 top-3.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* City Dropdown List */}
                  {cityDropdownOpen && selectedState && (
                    <div className="absolute top-[72px] left-0 right-0 max-h-56 overflow-y-auto bg-[#0a0a0a] border border-border rounded-xl shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      {filteredCities.length === 0 ? (
                        <div className="p-3.5 text-xs text-muted-foreground text-center">No cities found</div>
                      ) : (
                        filteredCities.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => {
                              setSelectedCity({
                                name: c.name,
                                latitude: c.latitude || "",
                                longitude: c.longitude || "",
                              });
                              setCitySearch(c.name);
                              setCityDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-xs text-muted-foreground hover:text-foreground hover:bg-primary/5 border-b border-border/40 last:border-b-0 cursor-pointer font-medium"
                          >
                            {c.name}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={createListingMutation.isPending}
                  className="px-6 py-3 border border-border hover:bg-muted/40 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 select-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={createListingMutation.isPending || !selectedState || !selectedCity}
                  className="px-8 py-3 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-sm font-extrabold transition-all cursor-pointer disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed uppercase tracking-wider flex items-center gap-2.5 shadow-md shadow-primary/10 hover:shadow-primary/20"
                >
                  {createListingMutation.isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Listing</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
