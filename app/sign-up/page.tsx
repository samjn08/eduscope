import Image from 'next/image'
import { signup } from '../login/actions'
import Link from 'next/link'

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-[#091222] flex items-center justify-center p-4 text-gray-200">
            <div className="w-full max-w-md">
                
                {/* Header */}
                <div className="text-center mb-6">
                    <Image src='/logo.png' alt="Logo" width={100} height={100} className="mx-auto" />
                    <p className="text-2xl font-semibold tracking-wider text-white mt-2">
                        EduScope
                    </p>
                    <p className="text-gray-400 text-sm">
                        Future-Ready Guidance, Powered by AI.
                    </p>
                </div>

                {/* Sign Up Card */}
                <div className="bg-[#0e182e] rounded-lg shadow-xl border border-[#1c293f]/50 backdrop-blur-xl">
                    <div className="px-6 py-4 border-b border-[#22314b]">
                        <h2 className="text-xl font-bold text-white">Create Your Account</h2>
                        <p className="text-sm text-gray-400 mt-1">
                            Join EduScope and start your learning journey today.
                        </p>
                    </div>

                    <div className="px-6 py-6">
                        <form className="space-y-5">

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 bg-[#0c1426] border border-[#1c2a42] rounded-md text-gray-100 placeholder-gray-500 focus:border-[#4d8aff] focus:ring-2 focus:ring-[#4d8aff50] transition-all duration-200"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 bg-[#0c1426] border border-[#1c2a42] rounded-md text-gray-100 placeholder-gray-500 focus:border-[#4d8aff] focus:ring-2 focus:ring-[#4d8aff50] transition-all duration-200"
                                    placeholder="Create a strong password"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Password must be at least 8 characters long
                                </p>
                            </div>

                            {/* Confirm */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 bg-[#0c1426] border border-[#1c2a42] rounded-md text-gray-100 placeholder-gray-500 focus:border-[#4d8aff] focus:ring-2 focus:ring-[#4d8aff50] transition-all duration-200"
                                    placeholder="Confirm your password"
                                />
                            </div>

                            {/* Terms */}
                            <div className="flex items-start">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-[#4d8aff] bg-[#0c1426] focus:ring-[#4d8aff] border-gray-600 rounded mt-1"
                                />
                                <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-[#4d8aff] underline underline-offset-2 hover:text-[#76a8ff]">
                                        Terms of Service
                                    </Link>
                                    {" "}and{" "}
                                    <Link href="/privacy" className="text-[#4d8aff] underline underline-offset-2 hover:text-[#76a8ff]">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            {/* Button */}
                            <button
                                formAction={signup}
                                className="w-full py-3 px-4 bg-[#4d8aff] text-white font-bold uppercase tracking-wide rounded-md hover:bg-[#3c6dd6] focus:outline-none focus:ring-4 focus:ring-[#4d8aff50] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#4d8aff30]"
                            >
                                Create Account
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#27354c]" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-[#0e182e] text-gray-400">
                                        Already have an account?
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Login Link */}
                        <div className="mt-4 text-center">
                            <Link
                                href="/login"
                                className="font-medium text-[#4d8aff] hover:text-[#76a8ff] transition-colors"
                            >
                                Sign in →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <div className="flex justify-center space-x-6 text-sm text-gray-500">
                        <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
                        <Link href="/support" className="hover:text-gray-300 transition-colors">Support</Link>
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                        © 2025 EduScope. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}
