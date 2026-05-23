"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSendOtp, useVerifyOtp } from "@/api/hooks/user/auth";

export default function AuthPage() {
  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [otpValues, setOtpValues] = useState<string[]>(Array(4).fill(""));
  const [step, setStep] = useState<"send" | "verify">("send");
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();

  // Input refs for split OTP inputs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Focus the first OTP box when entering verify screen
  useEffect(() => {
    if (step === "verify") {
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // Handle Send OTP form submission
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!mobile) {
      setError("Please enter your mobile number");
      return;
    }
    const isNumeric = /^\d+$/.test(mobile);
    if (!isNumeric || mobile.length < 10 || mobile.length > 15) {
      setError("Please enter a valid mobile number (10-15 digits)");
      return;
    }

    sendOtpMutation.mutate(
      { mobile },
      {
        onSuccess: (response) => {
          setStep("verify");
          setTimer(25); // Set Resend cooldown to 00:25 as shown in mockup
          setSuccessMessage(response.message);
        },
        onError: (err: any) => {
          const apiError = err.response?.data?.message || err.message || "Failed to send OTP.";
          setError(apiError);
        },
      }
    );
  };

  // Handle Verify OTP form submission
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const fullOtp = otpValues.join("");
    if (fullOtp.length !== 4) {
      setError("Please enter the 4-digit code");
      return;
    }

    verifyOtpMutation.mutate(
      { mobile, otp: fullOtp },
      {
        onSuccess: (response) => {
          if (typeof window !== "undefined") {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
          }
          router.push("/");
        },
        onError: (err: any) => {
          const apiError = err.response?.data?.message || err.message || "Incorrect verification code.";
          setError(apiError);
        },
      }
    );
  };

  // Handles input in individual split boxes
  const handleOtpChange = (value: string, index: number) => {
    const char = value.slice(-1).replace(/\D/g, "");
    const nextOtpValues = [...otpValues];
    nextOtpValues[index] = char;
    setOtpValues(nextOtpValues);

    if (char && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handles backspace key navigation
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const nextOtpValues = [...otpValues];
      
      // If current is empty, clear previous and move back
      if (!otpValues[index] && index > 0) {
        nextOtpValues[index - 1] = "";
        setOtpValues(nextOtpValues);
        otpRefs.current[index - 1]?.focus();
      } else {
        nextOtpValues[index] = "";
        setOtpValues(nextOtpValues);
      }
    }
  };

  // Handles clipboard paste of a 4-digit numeric code
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasteData.length === 4) {
      const nextOtpValues = pasteData.split("");
      setOtpValues(nextOtpValues);
      otpRefs.current[3]?.focus();
    }
  };

  const handleBackToSubmit = () => {
    setStep("send");
    setError(null);
    setSuccessMessage(null);
    setOtpValues(Array(4).fill(""));
  };

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
        <div className="absolute inset-y-0 right-0 w-80 bg-gradient-to-l from-background via-background/60 to-transparent" />
      </div>

      {/* Right Panel: Contains the Card */}
      <div className="w-full md:w-[48%] lg:w-[42%] flex items-center justify-center p-0 md:p-6 min-h-screen bg-background">
        <div className="relative w-full h-full min-h-screen md:min-h-0 md:max-w-[400px] bg-background md:bg-card border-0 md:border border-border rounded-none md:rounded-2xl shadow-none md:shadow-[0_8px_30px_rgb(0,0,0,0.02)] md:dark:shadow-[0_24px_50px_rgba(0,0,0,0.4)] p-6 sm:p-8 md:p-9 flex flex-col justify-center transition-all duration-300">
          
          {/* Circular Back Button (Only shown in Step 2) */}
          {step === "verify" && (
            <button
              type="button"
              onClick={handleBackToSubmit}
              className="absolute top-6 left-6 w-9 h-9 bg-card border border-border hover:bg-muted/40 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-sm"
              aria-label="Go back"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Logo brand banner - enlarged size */}
          <div className="flex flex-col items-center mb-8 mt-2 select-none">
            <img src="/logo/logo.png" alt="PashuSetu Logo" className="h-36 md:h-40 object-contain" />
          </div>

          {/* Stepper Steps (1 Enter Phone -> 2 Verify OTP) */}
          <div className="flex items-center justify-between mb-8 text-[11px] font-bold select-none max-w-[280px] mx-auto">
            <div className="flex items-center gap-1.5">
              <div className="w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] bg-primary text-primary-foreground font-bold">
                {step === "send" ? "1" : "✓"}
              </div>
              <span className={step === "send" ? "text-foreground font-semibold" : "text-muted-foreground font-normal"}>Enter Phone</span>
            </div>
            <div className={`flex-1 h-[2px] mx-3 ${step === "verify" ? "bg-primary" : "bg-border"}`} />
            <div className="flex items-center gap-1.5">
              <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] border font-bold ${step === "verify" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}>
                2
              </div>
              <span className={step === "verify" ? "text-foreground font-semibold" : "text-muted-foreground font-normal"}>Verify OTP</span>
            </div>
          </div>

          {/* Step 1: Send OTP Form */}
          {step === "send" && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5 text-center">
                <h1 className="text-xl font-bold text-foreground tracking-tight">
                  Enter your mobile number
                </h1>
                <p className="text-xs text-muted-foreground">
                  We will send you a 4-digit OTP to login
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="relative flex items-center bg-background border border-border hover:border-border/80 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/5 rounded-lg overflow-hidden transition-all shadow-inner">
                  <div className="flex items-center gap-1 px-3 py-3.5 border-r border-border bg-muted/20 select-none">
                    <span className="text-sm">🇮🇳</span>
                    <span className="text-xs font-bold text-foreground">+91</span>
                    <svg className="w-2.5 h-2.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <input
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter your mobile number"
                    className="w-full pl-3 pr-4 py-3 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground/60 tracking-wider font-semibold font-mono"
                    disabled={sendOtpMutation.isPending}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-500/[0.04] border border-rose-500/10 p-3 rounded-lg">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={sendOtpMutation.isPending}
                className="w-full py-3.5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed shadow-sm uppercase tracking-wider"
              >
                {sendOtpMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>

              <p className="text-[10px] text-center text-muted-foreground/75 leading-relaxed max-w-[270px] mx-auto select-none mt-1">
                By continuing, you agree to our{" "}
                <a href="#" className="underline text-primary hover:text-primary/90 font-bold">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="underline text-primary hover:text-primary/90 font-bold">Privacy Policy</a>
              </p>
            </form>
          )}

          {/* Step 2: Verify OTP Form */}
          {step === "verify" && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5 text-center">
                <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center justify-center gap-1.5">
                  <span>Enter OTP</span>
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </h1>
                <p className="text-xs text-muted-foreground">
                  We've sent a 4-digit OTP to{" "}
                  <span className="font-semibold text-foreground font-mono">+{mobile}</span>
                </p>
              </div>

              {/* Split OTP Fields (4 inputs) */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-center gap-3.5 max-w-sm mx-auto w-full">
                  {otpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-12 bg-background border border-border text-center text-lg font-bold font-mono text-foreground rounded-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/5 outline-none transition-all shadow-inner"
                      disabled={verifyOtpMutation.isPending}
                    />
                  ))}
                </div>
                
                <div className="text-center select-none mt-1.5">
                  {timer > 0 ? (
                    <p className="text-[11px] text-muted-foreground font-semibold">
                      Resend OTP in <span className="text-primary font-bold font-mono">00:{timer < 10 ? "0" + timer : timer}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={sendOtpMutation.isPending}
                      className="text-xs text-primary hover:text-primary/90 font-bold transition-colors hover:underline cursor-pointer disabled:text-muted-foreground"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-500/[0.04] border border-rose-500/10 p-3 rounded-lg">
                  <svg className="w-4.5 h-4.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {successMessage && !error && (
                <div className="flex items-start gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/[0.04] border border-emerald-500/10 p-3 rounded-lg">
                  <svg className="w-4.5 h-4.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{successMessage}</span>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={verifyOtpMutation.isPending}
                  className="w-full py-3.5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed shadow-sm uppercase tracking-wider"
                >
                  {verifyOtpMutation.isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    "Verify & Login"
                  )}
                </button>
                
                <div className="text-center select-none text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1.5 mt-2">
                  <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Your number is safe with us</span>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}
