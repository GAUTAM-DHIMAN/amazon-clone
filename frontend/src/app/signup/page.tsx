"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 🔥 DEBUG (IMPORTANT)
    console.log("FORM DATA:", formData);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (formData.password.length < 6) {
      return setError("Passwords must be at least 6 characters.");
    }

    setLoading(true);

    try {
      const result = await signup(
        formData.name,
        formData.email,
        formData.password
      );

      console.log("SIGNUP RESPONSE:", result);

      // ✅ FIX: correct response check
      if (result?.status === "success") {
        alert("Signup successful ✅");
        router.push("/");
        router.refresh();
      } else {
        setError(result?.message || "Registration failed. Try again.");
      }
    } catch (err: any) {
      console.error("SIGNUP ERROR:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-10 px-4 text-black">
      <Link href="/" className="mb-8">
        <div className="text-3xl font-bold flex items-center">
          <span>amazon</span>
          <span className="font-light">clone</span>
        </div>
      </Link>

      <div className="w-full max-w-[350px]">
        <div className="border border-gray-300 rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-medium mb-4">Create account</h1>

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-800">
                Your name
              </label>
              <input
                type="text"
                placeholder="First and last name"
                className="w-full border border-gray-400 px-3 py-1.5 rounded-sm outline-none focus:ring-1 focus:ring-[#e77600]"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1 text-gray-800">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-400 px-3 py-1.5 rounded-sm outline-none focus:ring-1 focus:ring-[#e77600]"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1 text-gray-800">
                Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                className="w-full border border-gray-400 px-3 py-1.5 rounded-sm outline-none focus:ring-1 focus:ring-[#e77600]"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1 text-gray-800">
                Re-enter password
              </label>
              <input
                type="password"
                className="w-full border border-gray-400 px-3 py-1.5 rounded-sm outline-none focus:ring-1 focus:ring-[#e77600]"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#f0c14b] border border-[#a88734] hover:bg-[#f7dfa1] py-1.5 rounded-sm shadow-sm text-sm font-medium mt-2"
            >
              {loading ? "Creating account..." : "Continue"}
            </button>
          </form>

          <div className="mt-6 text-xs text-gray-600 space-y-4">
            <p>
              By creating an account, you agree to Amazon Clone's{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Conditions of Use
              </span>{" "}
              and{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Privacy Notice
              </span>.
            </p>

            <div className="border-t border-gray-200 pt-4">
              <p>
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-[11px] text-[#555] w-full max-w-[350px] border-t border-gray-200 pt-4">
        <div className="flex justify-center gap-6 text-blue-600 mb-2">
          <span className="hover:underline cursor-pointer">
            Conditions of Use
          </span>
          <span className="hover:underline cursor-pointer">
            Privacy Notice
          </span>
          <span className="hover:underline cursor-pointer">Help</span>
        </div>
        <p>© 1996-2026, AmazonClone.com</p>
      </footer>
    </div>
  );
}