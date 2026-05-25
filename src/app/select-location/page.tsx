"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { State, City } from "country-state-city";

export default function SelectLocationPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<{ name: string; isoCode: string } | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const stateRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  // Authenticate user check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
      } else {
        setLoading(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedState || !selectedCity) {
      setError("Please select both state and city");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "location",
        JSON.stringify({
          state: selectedState.name,
          stateCode: selectedState.isoCode,
          city: selectedCity,
        })
      );
    }

    router.push("/");
  };

  if (loading) {
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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background text-foreground transition-colors duration-300 font-sans">
      
      {/* Left Panel: Contains the background image for desktop */}
      <div className="hidden md:block md:w-[52%] lg:w-[58%] relative min-h-screen overflow-hidden select-none bg-background">
        <img
          src="/login/cows.png"
          alt="PashuSetu Banner"
          className="w-full h-full object-cover select-none"
        />
        {/* Soft edge blend gradient on the right edge */}
        <div className="absolute inset-y-0 right-0 w-80 bg-linear-to-l from-background via-background/60 to-transparent" />
      </div>

      {/* Right Panel: Contains the Card */}
      <div className="w-full md:w-[48%] lg:w-[42%] flex items-center justify-center p-0 md:p-6 min-h-screen bg-background">
        <div className="relative w-full h-full min-h-screen md:min-h-0 md:max-w-[400px] bg-background md:bg-card border-0 md:border border-border rounded-none md:rounded-2xl shadow-none md:shadow-[0_8px_30px_rgb(0,0,0,0.02)] md:dark:shadow-[0_24px_50px_rgba(0,0,0,0.4)] p-6 sm:p-8 md:p-9 flex flex-col justify-center transition-all duration-300">
          
          {/* Logo brand banner */}
          <div className="flex flex-col items-center mb-8 mt-2 select-none">
            <img src="/logo/logo.png" alt="PashuSetu Logo" className="h-36 md:h-40 object-contain" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5 text-center">
              <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center justify-center gap-1.5">
                <span>Select Location</span>
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </h1>
              <p className="text-xs text-muted-foreground">
                Please select the state and city where you live to customize your experience
              </p>
            </div>

            <div className="flex flex-col gap-4">
              
              {/* State Dropdown */}
              <div ref={stateRef} className="relative flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">State</label>
                <div className="relative">
                  <input
                    type="text"
                    value={stateSearch}
                    onChange={(e) => {
                      setStateSearch(e.target.value);
                      setStateDropdownOpen(true);
                    }}
                    onFocus={() => {
                      setStateDropdownOpen(true);
                    }}
                    placeholder="Search and select state"
                    className="w-full pl-3 pr-10 py-3 bg-background border border-border hover:border-border/80 focus:border-primary/50 focus:ring-2 focus:ring-primary/5 rounded-lg outline-none text-sm placeholder:text-muted-foreground/60 transition-all font-semibold"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {stateDropdownOpen && (
                  <div className="absolute z-50 top-full left-0 w-full max-h-60 overflow-y-auto mt-1.5 bg-card border border-border rounded-lg shadow-lg">
                    {filteredStates.length > 0 ? (
                      filteredStates.map((s) => (
                        <button
                          key={s.isoCode}
                          type="button"
                          onClick={() => {
                            setSelectedState({ name: s.name, isoCode: s.isoCode });
                            setStateSearch(s.name);
                            setStateDropdownOpen(false);
                            setSelectedCity(null);
                            setCitySearch("");
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted/40 transition-colors focus:bg-muted/40 focus:outline-none text-foreground font-medium cursor-pointer"
                        >
                          {s.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2.5 text-xs text-muted-foreground">No states found</div>
                    )}
                  </div>
                )}
              </div>

              {/* City Dropdown */}
              <div ref={cityRef} className="relative flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">City</label>
                <div className="relative">
                  <input
                    type="text"
                    disabled={!selectedState}
                    value={citySearch}
                    onChange={(e) => {
                      setCitySearch(e.target.value);
                      setCityDropdownOpen(true);
                    }}
                    onFocus={() => {
                      if (selectedState) setCityDropdownOpen(true);
                    }}
                    placeholder={selectedState ? "Search and select city" : "Select state first"}
                    className="w-full pl-3 pr-10 py-3 bg-background border border-border hover:border-border/80 focus:border-primary/50 focus:ring-2 focus:ring-primary/5 rounded-lg outline-none text-sm placeholder:text-muted-foreground/60 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {cityDropdownOpen && selectedState && (
                  <div className="absolute z-50 top-full left-0 w-full max-h-60 overflow-y-auto mt-1.5 bg-card border border-border rounded-lg shadow-lg">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((c, idx) => (
                        <button
                          key={`${c.name}-${idx}`}
                          type="button"
                          onClick={() => {
                            setSelectedCity(c.name);
                            setCitySearch(c.name);
                            setCityDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted/40 transition-colors focus:bg-muted/40 focus:outline-none text-foreground font-medium cursor-pointer"
                        >
                          {c.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2.5 text-xs text-muted-foreground">No cities found</div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-500/4 border border-rose-500/10 p-3 rounded-lg">
                <svg className="w-4.5 h-4.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedState || !selectedCity}
              className="w-full py-3.5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed shadow-sm uppercase tracking-wider"
            >
              Continue to Home
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}
