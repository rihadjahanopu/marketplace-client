"use client";

import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2, Lock, Save, User as UserIcon, Fingerprint, Shield, Bell } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
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

	const [activeTab, setActiveTab] = useState("profile");
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
					await checkAuth();
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
			await checkAuth();
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

	const sidebarNav = [
		{ id: "profile", label: "Profile", icon: UserIcon },
		{ id: "security", label: "Security", icon: Lock },
		{ id: "notifications", label: "Notifications", icon: Bell },
	];

	return (
		<div className="pt-24 pb-16 min-h-screen bg-gray-50">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
					<p className="text-gray-600">Manage your profile, security, and preferences.</p>
				</div>

				<div className="flex flex-col md:flex-row gap-8">
					{/* Sidebar */}
					<aside className="w-full md:w-64 shrink-0 space-y-2">
						{sidebarNav.map((item) => {
							const isActive = activeTab === item.id;
							return (
								<button
									key={item.id}
									onClick={() => setActiveTab(item.id)}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
										isActive
											? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
											: "text-gray-600 hover:bg-white hover:text-gray-900"
									}`}
								>
									<item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
									{item.label}
								</button>
							);
						})}
					</aside>

					{/* Main Content Area */}
					<div className="flex-1 min-w-0">
						<AnimatePresence mode="wait">
							{activeTab === "profile" && (
								<motion.div
									key="profile"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
									className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100"
								>
									<div className="border-b border-gray-100 pb-6 mb-6">
										<h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
										<p className="text-sm text-gray-500 mt-1">Update your photo and personal details here.</p>
									</div>

									{/* Avatar Upload */}
									<div className="flex items-center gap-6 mb-8">
										<div className="relative group cursor-pointer shrink-0">
											<div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center relative">
												{isUploadingImage ? (
													<Loader2 className="w-6 h-6 animate-spin text-primary-600" />
												) : user?.image ? (
													<img src={user.image} alt={user.name} className="w-full h-full object-cover" />
												) : (
													<span className="text-3xl font-semibold text-gray-400">
														{user?.name?.charAt(0).toUpperCase()}
													</span>
												)}
											</div>
											{!isUploadingImage && (
												<label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]">
													<Camera className="w-6 h-6 text-white" />
													<input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
												</label>
											)}
										</div>
										<div>
											<h3 className="text-sm font-medium text-gray-900">Profile Picture</h3>
											<p className="text-xs text-gray-500 mt-1 mb-3">PNG, JPG up to 5MB.</p>
											<label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg cursor-pointer transition-colors inline-block">
												Change Picture
												<input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
											</label>
										</div>
									</div>

									<form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5 max-w-xl">
										<div className="space-y-1">
											<label className="text-sm font-medium text-gray-700">
												Full Name
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
													<UserIcon className="h-5 w-5 text-gray-400" />
												</div>
												<input
													{...registerProfile("name")}
													type="text"
													className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50/50"
												/>
											</div>
											{profileErrors.name && (
												<p className="text-sm text-red-600 mt-1">{profileErrors.name.message}</p>
											)}
										</div>

										<div className="space-y-1">
											<label className="text-sm font-medium text-gray-700">
												Email Address
											</label>
											<div className="relative">
												<input
													type="email"
													value={user.email}
													disabled
													className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
												/>
												<div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
													<Lock className="h-4 w-4 text-gray-400" />
												</div>
											</div>
											<p className="text-xs text-gray-500 mt-1">
												Your email is used for login and cannot be changed here.
											</p>
										</div>

										<div className="pt-4 flex justify-end">
											<button
												type="submit"
												disabled={isUpdatingProfile}
												className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm"
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
							)}

							{activeTab === "security" && (
								<motion.div
									key="security"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
									className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100"
								>
									<div className="border-b border-gray-100 pb-6 mb-6">
										<h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
											<Shield className="w-5 h-5 text-primary-600" />
											Security Settings
										</h2>
										<p className="text-sm text-gray-500 mt-1">Manage your password and authentication methods.</p>
									</div>

									<form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5 max-w-xl mb-10">
										<h3 className="text-sm font-semibold text-gray-900 mb-2">Change Password</h3>
										
										<div className="space-y-1">
											<label className="text-sm font-medium text-gray-700">Current Password</label>
											<input
												{...registerPassword("currentPassword")}
												type="password"
												className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
											/>
											{passwordErrors.currentPassword && (
												<p className="text-sm text-red-600 mt-1">{passwordErrors.currentPassword.message}</p>
											)}
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
											<div className="space-y-1">
												<label className="text-sm font-medium text-gray-700">New Password</label>
												<input
													{...registerPassword("newPassword")}
													type="password"
													className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
												/>
												{passwordErrors.newPassword && (
													<p className="text-sm text-red-600 mt-1">{passwordErrors.newPassword.message}</p>
												)}
											</div>

											<div className="space-y-1">
												<label className="text-sm font-medium text-gray-700">Confirm Password</label>
												<input
													{...registerPassword("confirmPassword")}
													type="password"
													className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
												/>
												{passwordErrors.confirmPassword && (
													<p className="text-sm text-red-600 mt-1">{passwordErrors.confirmPassword.message}</p>
												)}
											</div>
										</div>

										<div className="pt-4 flex justify-end">
											<button
												type="submit"
												disabled={isUpdatingPassword}
												className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm"
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

									<div className="pt-8 border-t border-gray-100">
										<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
											<div>
												<h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-1">
													<Fingerprint className="w-5 h-5 text-gray-700" />
													Passkeys
												</h3>
												<p className="text-sm text-gray-500 max-w-sm">
													Register a passkey (like Face ID or Touch ID) to sign in faster and more securely without a password.
												</p>
											</div>
											<button
												onClick={handleRegisterPasskey}
												disabled={isRegisteringPasskey}
												className="px-5 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-70 shrink-0"
											>
												{isRegisteringPasskey ? (
													<Loader2 className="w-4 h-4 animate-spin" />
												) : (
													<Fingerprint className="w-4 h-4" />
												)}
												Add Passkey
											</button>
										</div>
									</div>
								</motion.div>
							)}

							{activeTab === "notifications" && (
								<motion.div
									key="notifications"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
									className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100 flex flex-col items-center justify-center text-center py-20"
								>
									<div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
										<Bell className="w-8 h-8 text-gray-400" />
									</div>
									<h3 className="text-lg font-bold text-gray-900 mb-2">Notification Preferences</h3>
									<p className="text-gray-500 max-w-sm">
										We'll be adding detailed notification settings soon. You'll be able to control email and push notifications here.
									</p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</div>
	);
}
