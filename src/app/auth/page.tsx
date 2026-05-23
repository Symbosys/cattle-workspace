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
          setTimer(60);
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
          // Redirect to root "/" immediately
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
    <div className="flex flex-1 flex-col items-center justify-center p-6 min-h-screen bg-zinc-950 text-zinc-50 relative overflow-hidden select-none font-sans">
      
      {/* Premium ambient grid overlay & background styling */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "2.5rem 2.5rem",
          maskImage: "radial-gradient(ellipse 55% 55% at 50% 50%, #000 65%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 55% 55% at 50% 50%, #000 65%, transparent 100%)"
        }}
      />
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[450px] h-[450px] rounded-full bg-emerald-500/[0.04] blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-teal-500/[0.04] blur-[130px] pointer-events-none" />

      {/* Main Glass Card with gradient highlight */}
      <div className="relative w-full max-w-sm bg-zinc-900/30 backdrop-blur-2xl border border-zinc-800/60 rounded-2xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] p-8 md:p-9 transition-all duration-300">
        
        {/* Sleek top lighting bar */}
        <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
        
        {/* Brand identity */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 bg-zinc-900/80 border border-zinc-800/80 rounded-xl flex items-center justify-center mb-3 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]">
            <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 18c-3.3 0-6-2.7-6-6v-2c0-1.7 1.3-3 3-3h6c1.7 0 3 1.3 3 3v2c0 3.3-2.7 6-6 6z" />
              <path d="M5 6c0 0-2 2-2 4s2 2 2 2" />
              <path d="M19 6c0 0 2 2 2 4s-2 2-2 2" />
              <circle cx="12" cy="11.5" r="1" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase select-none">
            Pashu
          </h2>
        </div>

        {/* Step 1: Send OTP */}
        {step === "send" && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
                Log in or sign up
              </h1>
              <p className="text-xs text-zinc-500">
                Enter your mobile number to access Pashu
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="mobile" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Mobile Number
              </label>
              <div className="relative flex items-center bg-zinc-950/40 border border-zinc-800/80 hover:border-zinc-700/80 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/5 rounded-xl transition-all">
                <span className="pl-4 pr-2.5 text-sm text-zinc-500 font-semibold border-r border-zinc-800/60 mr-2 py-3 select-none">
                  +
                </span>
                <input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder="919876543210"
                  className="w-full pr-4 py-3 bg-transparent text-zinc-100 text-sm outline-none placeholder:text-zinc-700 tracking-wider font-semibold font-mono"
                  disabled={sendOtpMutation.isPending}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-rose-400 bg-rose-500/[0.03] border border-rose-500/10 p-3 rounded-xl">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={sendOtpMutation.isPending}
              className="w-full py-3.5 bg-zinc-100 hover:bg-white active:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl text-sm font-semibold text-zinc-950 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-[0_8px_16px_-4px_rgba(255,255,255,0.05)]"
            >
              {sendOtpMutation.isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-zinc-950" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending code...</span>
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === "verify" && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
            <button
              type="button"
              onClick={handleBackToSubmit}
              className="self-start text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors group cursor-pointer font-medium"
            >
              <svg className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Change number
            </button>

            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
                Enter verification code
              </h1>
              <p className="text-xs text-zinc-500">
                Code sent to <span className="font-semibold text-zinc-300 font-mono">+{mobile}</span>
              </p>
            </div>

            {/* Split OTP Fields */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-center gap-2.5">
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
                    className="w-12 h-12 bg-zinc-950/40 border border-zinc-800/80 text-center text-lg font-bold font-mono text-zinc-100 rounded-xl focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/5 outline-none transition-all shadow-inner"
                    disabled={verifyOtpMutation.isPending}
                  />
                ))}
              </div>
              <span className="text-[10px] text-zinc-600 text-center font-medium select-none">
                Tip: You can paste the complete 4-digit code directly
              </span>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-rose-400 bg-rose-500/[0.03] border border-rose-500/10 p-3 rounded-xl">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {successMessage && !error && (
              <div className="flex items-start gap-2 text-xs text-emerald-400 bg-emerald-500/[0.03] border border-emerald-500/10 p-3 rounded-xl">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{successMessage}</span>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={verifyOtpMutation.isPending}
                className="w-full py-3.5 bg-zinc-100 hover:bg-white active:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl text-sm font-semibold text-zinc-950 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-[0_8px_16px_-4px_rgba(255,255,255,0.05)]"
              >
                {verifyOtpMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-zinc-950" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Verifying...</span>
                  </>
                ) : (
                  "Verify code"
                )}
              </button>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-[11px] text-zinc-500 font-medium select-none">
                    Resend code in <span className="text-zinc-400 font-semibold font-mono">{timer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendOtpMutation.isPending}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors hover:underline cursor-pointer disabled:text-zinc-600"
                  >
                    Resend code
                  </button>
                )}
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
