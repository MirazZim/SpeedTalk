import { useState } from "react";

import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";


import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import AuthImagePattern from "../../components/AuthImagePattern/AuthImagePattern";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const { signup, isSigningUp } = useAuthStore();

    const validateForm = () => {
        if (!formData.fullName.trim()) return toast.error("Full name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const success = validateForm();

        if (success === true) signup(formData);
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white gap-6">
            {/* right side */}
            <AuthImagePattern
                title="Join our community"
                subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
            />




            {/* left side */}
            <div className="mt-20 p-8 bg-white rounded-3xl shadow-md">

                {/* LOGO */}
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center gap-2 group">
                        <div
                            className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                        >
                            <MessageSquare className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-semibold mt-4 text-gray-900">Create an account</h1>
                        <p className="text-lg text-gray-600">Sign up to start your journey with us</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-gray-700 py-2">Full Name</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                className="input input-bordered w-full p-4 rounded-xl text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-150 ease-in-out"
                                placeholder="Your Name"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-gray-700">Email</span>
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                className="input input-bordered w-full p-4 rounded-xl text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-150 ease-in-out"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-gray-700">Password</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input input-bordered w-full p-4 rounded-xl text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-150 ease-in-out"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-500" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full rounded-xl" disabled={isSigningUp}>
                        {isSigningUp ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-gray-600 text-lg">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>

            </div>




        </div>
    );
};
export default SignUpPage;