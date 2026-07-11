"use client";

import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
	ArrowRight,
	Camera,
	Eye,
	EyeOff,
	Fingerprint,
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

// Lightweight schema just for passkey registration (no password needed)
const passkeySchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name cannot exceed 50 characters"),
	email: z.string().email("Please enter a valid email address"),
});

type RegisterForm = z.infer<typeof registerSchema>;
type PasskeyForm = z.infer<typeof passkeySchema>;

export default function RegisterPage() {
	const { register: registerUser } = useAuth();
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isPasskeySubmitting, setIsPasskeySubmitting] = useState(false);
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

	const handleGoogleSignUp = async () => {
		try {
			await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });
		} catch (err: any) {
			toast.error(err.message || "Google sign-up failed");
		}
	};

	const [showPasskeyPrompt, setShowPasskeyPrompt] = useState(false);
	const [tempAccountCreated, setTempAccountCreated] = useState(false);

	const handlePasskeySignUp = async () => {
		// Validate just name and email fields
		const name = getValues("name");
		const email = getValues("email");

		if (!name || name.trim().length < 2) {
			toast.error("Please enter your full name first.");
			return;
		}
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			toast.error("Please enter a valid email address first.");
			return;
		}

		setError("");
		setIsPasskeySubmitting(true);
		try {
			// Step 1: Create account with a random secure password
			const tempPassword = crypto.randomUUID() + "Aa1!";
			const { error: signUpError } = await authClient.signUp.email({
				email,
				password: tempPassword,
				name: name.trim(),
			});
			if (signUpError) throw new Error(signUpError.message);

			// Step 2: Upload profile image if any
			if (selectedImage) {
				const formData = new FormData();
				formData.append("images", selectedImage);
				const uploadRes = await authApi.uploadImages(formData);
				if (uploadRes.success && uploadRes.urls.length > 0) {
					await authApi.updateProfile({ image: uploadRes.urls[0] });
				}
			}

			// Account created! Now we need a fresh user gesture to trigger the passkey prompt.
			setTempAccountCreated(true);
			setShowPasskeyPrompt(true);
		} catch (err: any) {
			const errorMsg = err.message || "Account creation failed. Please try again.";
			setError(errorMsg);
			toast.error(errorMsg);
		} finally {
			setIsPasskeySubmitting(false);
		}
	};

	const executePasskeyRegistration = async () => {
		setIsPasskeySubmitting(true);
		try {
			const name = getValues("name");
			const { error: passkeyError } = await authClient.passkey.addPasskey({ name: `${name.trim()}'s Passkey` });
			if (passkeyError) {
				toast.warn("Passkey setup was cancelled. You can add one later in Settings.");
			} else {
				toast.success("Account created with Passkey successfully!");
			}
			window.location.href = "/dashboard";
		} catch (err: any) {
			toast.error("Passkey registration failed. Continuing to dashboard...");
			setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
		} finally {
			setIsPasskeySubmitting(false);
		}
	};

	const skipPasskeyRegistration = () => {
		window.location.href = "/dashboard";
	};

	return (
		<div className="pt-24 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="w-full max-w-md mx-4"
			>
				<div className="bg-white rounded-2xl p-8 card-shadow">
					{showPasskeyPrompt ? (
						<div className="text-center py-6">
							<div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
								<Fingerprint className="w-8 h-8 text-green-600" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
							<p className="text-gray-600 mb-8">
								Would you like to set up a Passkey? This will allow you to sign in quickly and securely using your fingerprint, face, or screen lock without needing a password.
							</p>
							
							<div className="space-y-3">
								<button
									type="button"
									onClick={executePasskeyRegistration}
									disabled={isPasskeySubmitting}
									className="w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-primary-500/30"
								>
									{isPasskeySubmitting ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										<>
											<Fingerprint className="w-5 h-5" />
											Set Up Passkey
										</>
									)}
								</button>
								<button
									type="button"
									onClick={skipPasskeyRegistration}
									disabled={isPasskeySubmitting}
									className="w-full py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-70"
								>
									Skip for now
								</button>
							</div>
						</div>
					) : (
						<>
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

							<div className="relative my-6">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-200"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-2 bg-white text-gray-500">Or continue with</span>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<button
									type="button"
									onClick={handleGoogleSignUp}
									className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700 text-sm"
								>
									<svg className="w-5 h-5" viewBox="0 0 24 24">
										<path
											fill="#4285F4"
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										/>
										<path
											fill="#34A853"
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										/>
										<path
											fill="#FBBC05"
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										/>
										<path
											fill="#EA4335"
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										/>
									</svg>
									Google
								</button>
								<button
									type="button"
									onClick={handlePasskeySignUp}
									disabled={isPasskeySubmitting}
									className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700 text-sm disabled:opacity-70"
								>
									{isPasskeySubmitting && !tempAccountCreated ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										<Fingerprint className="w-5 h-5 text-primary-600" />
									)}
									Passkey
								</button>
							</div>

							<p className="mt-6 text-center text-sm text-gray-600">
								Already have an account?{" "}
								<Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
									Sign in
								</Link>
							</p>
						</>
					)}
				</div>
			</motion.div>
		</div>
	);
}
