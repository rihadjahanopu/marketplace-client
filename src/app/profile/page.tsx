"use client";

import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import { motion } from "framer-motion";
import { Camera, Loader2, Lock, Save, User as UserIcon, Fingerprint } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	// Email is usually read-only unless we set up email verification flow for change
});

const passwordSchema = z
	.object({
		currentPassword: z.string().min(6, "Password must be at least 6 characters"),
		newPassword: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
	const { user, isAuthenticated, isLoading: authLoading, checkAuth } = useAuth();
	const router = useRouter();

	const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
	const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
	const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);
	const [isUploadingImage, setIsUploadingImage] = useState(false);

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setIsUploadingImage(true);
			try {
				const formData = new FormData();
				formData.append("images", e.target.files[0]);
				const uploadRes = await authApi.uploadImages(formData);
				if (uploadRes.success && uploadRes.urls.length > 0) {
					await authApi.updateProfile({ image: uploadRes.urls[0] });
					toast.success("Profile picture updated!");
					await checkAuth(); // refresh user
				}
			} catch (err: any) {
				toast.error(err.message || "Failed to upload image");
			} finally {
				setIsUploadingImage(false);
			}
		}
	};

	const handleRegisterPasskey = async () => {
		setIsRegisteringPasskey(true);
		try {
			const { data, error } = await authClient.passkey.addPasskey();
			if (error) throw new Error(error.message);
			toast.success("Passkey registered successfully!");
		} catch (err: any) {
			toast.error(err.message || "Failed to register passkey");
		} finally {
			setIsRegisteringPasskey(false);
		}
	};

	const {
		register: registerProfile,
		handleSubmit: handleProfileSubmit,
		formState: { errors: profileErrors },
		reset: resetProfile,
	} = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
	});

	const {
		register: registerPassword,
		handleSubmit: handlePasswordSubmit,
		formState: { errors: passwordErrors },
		reset: resetPassword,
	} = useForm<PasswordFormValues>({
		resolver: zodResolver(passwordSchema),
	});

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [authLoading, isAuthenticated, router]);

	useEffect(() => {
		if (user) {
			resetProfile({ name: user.name || "" });
		}
	}, [user, resetProfile]);

	const onProfileSubmit = async (data: ProfileFormValues) => {
		setIsUpdatingProfile(true);
		try {
			await authApi.updateProfile({ name: data.name });
			toast.success("Profile updated successfully!");
			await checkAuth(); // Refresh the user data
		} catch (err: any) {
			toast.error(err.response?.data?.message || "Failed to update profile");
		} finally {
			setIsUpdatingProfile(false);
		}
	};

	const onPasswordSubmit = async (data: PasswordFormValues) => {
		setIsUpdatingPassword(true);
		try {
			await authApi.changePassword({
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
				revokeOtherSessions: true,
			});
			toast.success("Password changed successfully!");
			resetPassword();
		} catch (err: any) {
			toast.error(err.response?.data?.message || "Failed to change password");
		} finally {
			setIsUpdatingPassword(false);
		}
	};

	if (authLoading || !user) {
		return (
			<div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary-600" />
			</div>
		);
	}

	return (
		<div className="pt-24 pb-16 min-h-screen bg-gray-50">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
					<p className="text-gray-600">Manage your account preferences and personal information</p>
				</motion.div>

				<div className="space-y-6">
					{/* Profile Information Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-white rounded-2xl p-6 sm:p-8 card-shadow"
					>
						<h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
							<UserIcon className="w-5 h-5 text-primary-600" />
							Personal Information
						</h2>

						{/* Avatar Upload */}
						<div className="flex flex-col items-start mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
							<div className="relative group cursor-pointer">
								<div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
									{isUploadingImage ? (
										<Loader2 className="w-6 h-6 animate-spin text-primary-600" />
									) : user?.image ? (
										<img src={user.image} alt={user.name} className="w-full h-full object-cover" />
									) : (
										<span className="text-3xl font-medium text-gray-400">
											{user?.name?.charAt(0).toUpperCase()}
										</span>
									)}
								</div>
								{!isUploadingImage && (
									<label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
										<Camera className="w-6 h-6 text-white" />
										<input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
									</label>
								)}
							</div>
						</div>

						<form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Full Name
								</label>
								<input
									{...registerProfile("name")}
									type="text"
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
								/>
								{profileErrors.name && (
									<p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Email Address
								</label>
								<input
									type="email"
									value={user.email}
									disabled
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
								/>
								<p className="mt-1 text-xs text-gray-500">
									Your email address is used for logging in and cannot be changed here.
								</p>
							</div>

							<div className="pt-2">
								<button
									type="submit"
									disabled={isUpdatingProfile}
									className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-70"
								>
									{isUpdatingProfile ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<Save className="w-4 h-4" />
									)}
									Save Changes
								</button>
							</div>
						</form>
					</motion.div>

					{/* Security Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-white rounded-2xl p-6 sm:p-8 card-shadow"
					>
						<h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
							<Lock className="w-5 h-5 text-primary-600" />
							Security
						</h2>

						<form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Current Password
								</label>
								<input
									{...registerPassword("currentPassword")}
									type="password"
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
								/>
								{passwordErrors.currentPassword && (
									<p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
								)}
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										New Password
									</label>
									<input
										{...registerPassword("newPassword")}
										type="password"
										className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
									/>
									{passwordErrors.newPassword && (
										<p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Confirm New Password
									</label>
									<input
										{...registerPassword("confirmPassword")}
										type="password"
										className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
									/>
									{passwordErrors.confirmPassword && (
										<p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
									)}
								</div>
							</div>

							<div className="pt-2">
								<button
									type="submit"
									disabled={isUpdatingPassword}
									className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70"
								>
									{isUpdatingPassword ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<Lock className="w-4 h-4" />
									)}
									Update Password
								</button>
							</div>
						</form>

						<div className="mt-10 pt-8 border-t border-gray-100">
							<h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
								<Fingerprint className="w-5 h-5 text-gray-600" />
								Passkeys
							</h3>
							<p className="text-sm text-gray-600 mb-4">
								Register a passkey (like Face ID or Touch ID) to sign in faster and more securely without a password.
							</p>
							<button
								onClick={handleRegisterPasskey}
								disabled={isRegisteringPasskey}
								className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-70"
							>
								{isRegisteringPasskey ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Fingerprint className="w-4 h-4" />
								)}
								Register New Passkey
							</button>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
