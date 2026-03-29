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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result?.success) {
        router.push("/");
        router.refresh();
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
    <div className="min-h-screen bg-white flex flex-col items-center pt-10 px-4 text-black">
      {/* Logo */}
      <Link href="/" className="mb-8">
        <div className="text-3xl font-bold flex items-center">
          <span>amazon</span>
          <span className="font-light">clone</span>
        </div>
      </Link>

      <div className="w-full max-w-[350px] space-y-4">
        {/* Login Card */}
        <div className="border border-gray-300 rounded-lg p-6 flex flex-col shadow-sm">
          <h1 className="text-2xl font-medium mb-4">Sign in</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-400 px-3 py-1.5 rounded-sm focus:ring-1 focus:ring-[#e77600] border-gray-400 outline-none transition-all shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-gray-400 px-3 py-1.5 rounded-sm focus:ring-1 focus:ring-[#e77600] outline-none transition-all shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-[#f0c14b] border border-[#a88734] hover:bg-[#f7dfa1] py-1.5 rounded-sm shadow-sm text-sm active:bg-[#f0c14b]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-[12px] mt-4 leading-tight text-gray-600">
            By continuing, you agree to Amazon Clone's{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">Conditions of Use</span> and{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">Privacy Notice</span>.
          </p>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-xs">New to Amazon?</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Create Account Link */}
        <Link href="/signup">
          <button className="w-full border border-gray-300 bg-[#eff1f3] hover:bg-[#e7e9ec] py-1.5 rounded-sm shadow-sm text-sm">
            Create your Amazon account
          </button>
        </Link>
      </div>

      {/* Footer Links */}
      <footer className="mt-8 text-center text-[11px] text-[#555] w-full max-w-[350px] border-t border-gray-200 pt-4">
        <div className="flex justify-center gap-6 text-blue-600 mb-2">
          <span className="hover:underline cursor-pointer hover:text-orange-700">Conditions of Use</span>
          <span className="hover:underline cursor-pointer hover:text-orange-700">Privacy Notice</span>
          <span className="hover:underline cursor-pointer hover:text-orange-700">Help</span>
        </div>
        <p>© 1996-2026, AmazonClone.com, Inc. or its affiliates</p>
      </footer>
    </div>
  );
}