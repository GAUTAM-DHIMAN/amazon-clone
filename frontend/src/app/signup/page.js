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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
        formData.password,
      );

      if (result?.status === "success") {
        router.push("/");
        router.refresh();
      } else {
        setError(result?.message || "Registration failed. Try again.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
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

      <div className="w-full max-w-[350px]">
        <div className="border border-[#d5d9d9] rounded-lg p-6 shadow-[0_0_14px_rgba(0,0,0,0.08)]">
          <h1 className="text-[28px] font-normal mb-4 text-[#0f1111]">
            Create account
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

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-bold mb-1 text-[#0f1111]">
                Your name
              </label>
              <input
                type="text"
                placeholder="First and last name"
                className="w-full border border-[#888] px-3 py-2 rounded-sm outline-none focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] text-base"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1 text-[#0f1111]">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-[#888] px-3 py-2 rounded-sm outline-none focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] text-base"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1 text-[#0f1111]">
                Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                className="w-full border border-[#888] px-3 py-2 rounded-sm outline-none focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] text-base"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />

              <p className="text-xs text-[#565959] mt-1 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-1-1 4-4-4-4 1-1 5 5-5 5z" />
                </svg>
                Passwords must be at least 6 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1 text-[#0f1111]">
                Re-enter password
              </label>
              <input
                type="password"
                className="w-full border border-[#888] px-3 py-2 rounded-sm outline-none focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] text-base"
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
              className="amz-btn-add w-full py-2 text-sm font-medium mt-2"
            >
              {loading ? "Creating account..." : "Continue"}
            </button>
          </form>

          <div className="mt-6 text-xs text-[#565959] space-y-4">
            <p>
              By creating an account, you agree to Amazon Clone&apos;s{" "}
              <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
                Conditions of Use
              </span>{" "}
              and{" "}
              <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
                Privacy Notice
              </span>
              .
            </p>

            <div className="border-t border-[#e7e7e7] pt-4">
              <p>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#007185] hover:text-[#c7511f] hover:underline"
                >
                  Sign in ›
                </Link>
              </p>
            </div>
          </div>
        </div>
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
        <p>© 1996-2026, AmazonClone.com</p>
      </footer>
    </div>
  );
}
