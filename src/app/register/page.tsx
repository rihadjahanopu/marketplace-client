"use client";

import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
	ArrowRight,
	Camera,
	Eye,
	EyeOff,
	Loader2,
	Lock,
	Mail,
	User,
	UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { authApi } from "@/lib/api";

// Schema for email/password registration
const registerSchema = z
	.object({
		name: z
			.string()
			.min(2, "Name must be at least 2 characters")
			.max(50, "Name cannot exceed 50 characters"),
		email: z.string().email("Please enter a valid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const { register: registerUser } = useAuth();
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setSelectedImage(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	// Full register form (email + password)
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm<RegisterForm>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterForm) => {
		setError("");
		setIsSubmitting(true);
		try {
			const { data: signUpData, error: signUpError } = await authClient.signUp.email({
				email: data.email,
				password: data.password,
				name: data.name,
				rememberMe: true,
			} as any);
			if (signUpError) throw new Error(signUpError.message);

			// Save token — better-auth returns it when bearer plugin is active
			const token = (signUpData as any)?.token;
			if (token) {
				localStorage.setItem("token", token);
			} else {
				// Fallback: try to get session token via getSession
				try {
					const sess = await authClient.getSession();
					const sessToken = (sess?.data as any)?.session?.token;
					if (sessToken) localStorage.setItem("token", sessToken);
				} catch { /* ignore */ }
			}

			if (selectedImage) {
				const formData = new FormData();
				formData.append("images", selectedImage);
				const uploadRes = await authApi.uploadImages(formData);
				if (uploadRes.success && uploadRes.urls.length > 0) {
					await authApi.updateProfile({ image: uploadRes.urls[0] });
				}
			}

			toast.success("Registered successfully!");
			window.location.href = "/dashboard";
		} catch (err: any) {
			const errorMsg = err.message || "Registration failed. Please try again.";
			setError(errorMsg);
			toast.error(errorMsg);
		} finally {
			setIsSubmitting(false);
		}
	};


	return (
		<div className="pt-24 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="w-full max-w-md mx-4"
			>
				<div className="bg-white rounded-2xl p-8 card-shadow">
							<div className="text-center mb-6">
								<div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
									<UserPlus className="w-7 h-7 text-white" />
								</div>
								<h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
								<p className="text-gray-600 mt-1">Join our marketplace community</p>
							</div>

							{error && (
								<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
									{error}
								</div>
							)}

							<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
								{/* Avatar Upload */}
								<div className="flex flex-col items-center justify-center mb-6">
									<label className="relative cursor-pointer group">
										<div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden group-hover:bg-gray-100 transition-colors">
											{imagePreview ? (
												<img src={imagePreview} alt="Avatar Preview" className="w-full h-full object-cover" />
											) : (
												<>
													<Camera className="w-6 h-6 text-gray-400 mb-1" />
													<span className="text-xs text-gray-500 font-medium">Avatar</span>
												</>
											)}
										</div>
										<input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
										{imagePreview && (
											<div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
												<Camera className="w-6 h-6 text-white" />
											</div>
										)}
									</label>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
										<input
											{...register("name")}
											type="text"
											placeholder="John Doe"
											className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
										/>
									</div>
									{errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
										<input
											{...register("email")}
											type="email"
											placeholder="you@example.com"
											className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
										/>
									</div>
									{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
										<input
											{...register("password")}
											type={showPassword ? "text" : "password"}
											placeholder="Create a password"
											className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
										>
											{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
										</button>
									</div>
									{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
										<input
											{...register("confirmPassword")}
											type={showPassword ? "text" : "password"}
											placeholder="Confirm your password"
											className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
										/>
									</div>
									{errors.confirmPassword && (
										<p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
									)}
								</div>

								<button
									type="submit"
									disabled={isSubmitting}
									className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
								>
									{isSubmitting ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										<>
											Create Account
											<ArrowRight className="w-4 h-4" />
										</>
									)}
								</button>
							</form>



							<p className="mt-6 text-center text-sm text-gray-600">
								Already have an account?{" "}
								<Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
									Sign in
								</Link>
							</p>
				</div>
			</motion.div>
		</div>
	);
}
