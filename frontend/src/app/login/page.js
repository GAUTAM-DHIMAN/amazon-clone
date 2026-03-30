"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result?.success) {
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get("redirect") || "/";
        window.location.href = redirectUrl;
      } else {
        setError(result?.message || "Invalid email or password.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 sm:pt-12 px-4 text-black">
      {/* Logo */}
      <Link href="/" className="mb-6">
        <div className="text-3xl font-bold flex items-center">
          <span className="text-[#0f1111]">amazon</span>
          <span className="text-[#febd69]">clone</span>
          <span className="text-[#0f1111] text-sm ml-0.5 font-normal">.in</span>
        </div>
      </Link>

      <div className="w-full max-w-[350px] space-y-4">
        {/* Login Card */}
        <div className="border border-[#d5d9d9] rounded-lg p-6 flex flex-col shadow-[0_0_14px_rgba(0,0,0,0.08)]">
          <h1 className="text-[28px] font-normal mb-4 text-[#0f1111]">
            Sign in
          </h1>

          {error && (
            <div className="flex items-start gap-2 bg-[#fcf4f4] border border-[#cc0c39]/30 text-[#cc0c39] px-3 py-2.5 rounded-lg text-sm mb-4">
              <svg
                className="w-5 h-5 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1 text-[#0f1111]">
                Email or mobile phone number
              </label>
              <input
                type="email"
                className="w-full border border-[#888] px-3 py-2 rounded-sm focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none transition-all shadow-inner text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-[#0f1111]">
                Password
              </label>
              <input
                type="password"
                className="w-full border border-[#888] px-3 py-2 rounded-sm focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none transition-all shadow-inner text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              disabled={loading}
              className="amz-btn-add w-full py-2 text-sm font-medium"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-[12px] mt-4 leading-relaxed text-[#565959]">
            By continuing, you agree to Amazon Clone&apos;s{" "}
            <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
              Conditions of Use
            </span>{" "}
            and{" "}
            <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
              Privacy Notice
            </span>
            .
          </p>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-[#e7e7e7]" />
          <span className="flex-shrink mx-4 text-[#565959] text-xs">
            New to Amazon Clone?
          </span>
          <div className="flex-grow border-t border-[#e7e7e7]" />
        </div>

        {/* Create Account */}
        <Link href="/signup">
          <button className="amz-btn-secondary w-full py-2 text-sm font-normal">
            Create your Amazon Clone account
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-[11px] text-[#555] w-full max-w-[350px] border-t border-[#e7e7e7] pt-4 pb-8">
        <div className="flex justify-center gap-6 mb-2">
          <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
            Conditions of Use
          </span>
          <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
            Privacy Notice
          </span>
          <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
            Help
          </span>
        </div>
        <p>© 1996-2026, AmazonClone.com, Inc. or its affiliates</p>
      </footer>
    </div>
  );
}
