"use client";

import React, { useState, useEffect } from "react";
import { useSendOtp, useVerifyOtp } from "@/api/hooks/user/auth";
import type { AuthUser } from "@/types/user.types";

export default function AuthPage() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"send" | "verify" | "success">("send");
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Authenticated state persistence (mock display)
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();

  // Countdown timer for OTP resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle Send OTP Form Submission
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Basic Validation
    if (!mobile) {
      setError("Mobile number is required");
      return;
    }
    const isNumeric = /^\d+$/.test(mobile);
    if (!isNumeric || mobile.length < 10 || mobile.length > 15) {
      setError("Please enter a valid mobile number (10 to 15 digits)");
      return;
    }

    sendOtpMutation.mutate(
      { mobile },
      {
        onSuccess: (response) => {
          setStep("verify");
          setTimer(60); // 60-second cooldown
          setSuccessMessage(response.message);
        },
        onError: (err: any) => {
          const apiError = err.response?.data?.message || err.message || "Failed to send OTP. Please try again.";
          setError(apiError);
        },
      }
    );
  };

  // Handle Verify OTP Form Submission
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!otp) {
      setError("Please enter the verification code");
      return;
    }
    if (otp.length < 4 || otp.length > 6) {
      setError("Please enter a valid OTP code");
      return;
    }

    verifyOtpMutation.mutate(
      { mobile, otp },
      {
        onSuccess: (response) => {
          setAuthenticatedUser(response.data.user);
          setAuthToken(response.data.token);
          setStep("success");
          setSuccessMessage(response.message);
          // Safely store token in client if window exists
          if (typeof window !== "undefined") {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
          }
        },
        onError: (err: any) => {
          const apiError = err.response?.data?.message || err.message || "Failed to verify OTP. Please try again.";
          setError(apiError);
        },
      }
    );
  };

  // Handle Going Back to Send OTP state
  const handleBackToSubmit = () => {
    setStep("send");
    setError(null);
    setSuccessMessage(null);
    setOtp("");
  };

  // Handle Logout/Reset state
  const handleReset = () => {
    setStep("send");
    setMobile("");
    setOtp("");
    setError(null);
    setSuccessMessage(null);
    setAuthenticatedUser(null);
    setAuthToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-6 bg-zinc-950 relative overflow-hidden select-none">
      {/* Decorative premium radial gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-[128px] pointer-events-none" />

      {/* Main glassmorphism card */}
      <div className="relative w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 rounded-2xl shadow-2xl p-8 transition-all duration-300">
        
        {/* Step 1: Send OTP Screen */}
        {step === "send" && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight bg-linear-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                Cattle Platform
              </h1>
              <p className="text-sm text-zinc-400">
                Sign in or register using your mobile number
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="mobile" className="text-xs font-medium text-zinc-300">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500 font-medium">
                  +
                </span>
                <input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder="919876543210"
                  className="w-full pl-7 pr-4 py-3 bg-zinc-950/80 border border-zinc-800 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 rounded-lg text-zinc-100 text-sm outline-none transition-all placeholder:text-zinc-600"
                  disabled={sendOtpMutation.isPending}
                />
              </div>
            </div>

            {error && (
              <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={sendOtpMutation.isPending}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg text-sm font-semibold text-zinc-950 transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {sendOtpMutation.isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-zinc-950" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending OTP...
                </>
              ) : (
                "Get OTP Verification Code"
              )}
            </button>
          </form>
        )}

        {/* Step 2: Verify OTP Screen */}
        {step === "verify" && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
            <button
              type="button"
              onClick={handleBackToSubmit}
              className="self-start text-xs text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors group cursor-pointer"
            >
              <svg
                className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to change number
            </button>

            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight bg-linear-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                Enter Code
              </h1>
              <p className="text-sm text-zinc-400">
                We sent a verification code to <span className="font-semibold text-zinc-300">+{mobile}</span>
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="otp" className="text-xs font-medium text-zinc-300">
                Verification Code (OTP)
              </label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-800 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 rounded-lg text-zinc-100 text-center tracking-[0.5em] text-lg font-mono outline-none transition-all placeholder:text-zinc-700"
                disabled={verifyOtpMutation.isPending}
              />
            </div>

            {error && (
              <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            {successMessage && !error && (
              <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
                {successMessage}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={verifyOtpMutation.isPending}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg text-sm font-semibold text-zinc-950 transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {verifyOtpMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-zinc-950" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Verify & Login"
                )}
              </button>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-xs text-zinc-500">
                    Resend code in <span className="font-semibold text-zinc-400">{timer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendOtpMutation.isPending}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors hover:underline cursor-pointer disabled:text-zinc-600 disabled:cursor-not-allowed"
                  >
                    Resend Verification Code
                  </button>
                )}
              </div>
            </div>
          </form>
        )}

        {/* Step 3: Success Authenticated Screen */}
        {step === "success" && authenticatedUser && (
          <div className="flex flex-col gap-6 text-center">
            <div className="flex flex-col items-center gap-3">
              {/* Success checkmark animation */}
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 scale-100 animate-bounce">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                Welcome Back!
              </h1>
              <p className="text-sm text-emerald-400 font-medium">
                {successMessage || "Authentication Successful"}
              </p>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-4 text-left flex flex-col gap-2">
              <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                User Details
              </div>
              <div className="text-sm text-zinc-300 flex justify-between">
                <span className="text-zinc-500">ID:</span>
                <span className="font-mono text-xs">{authenticatedUser.id}</span>
              </div>
              <div className="text-sm text-zinc-300 flex justify-between">
                <span className="text-zinc-500">Phone:</span>
                <span>+{authenticatedUser.phone}</span>
              </div>
              <div className="text-sm text-zinc-300 flex justify-between">
                <span className="text-zinc-500">Role:</span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {authenticatedUser.role}
                </span>
              </div>
              <div className="text-sm text-zinc-300 flex justify-between">
                <span className="text-zinc-500">Status:</span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {authenticatedUser.status}
                </span>
              </div>
              {authenticatedUser.name && (
                <div className="text-sm text-zinc-300 flex justify-between">
                  <span className="text-zinc-500">Name:</span>
                  <span>{authenticatedUser.name}</span>
                </div>
              )}
              {authenticatedUser.email && (
                <div className="text-sm text-zinc-300 flex justify-between">
                  <span className="text-zinc-500">Email:</span>
                  <span>{authenticatedUser.email}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-300 rounded-lg text-sm font-semibold transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
