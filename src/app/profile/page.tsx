"use client";

import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
	Camera,
	Loader2,
	Lock,
	Save,
	User as UserIcon,
	Shield,
	Bell,
	Trash2,
	Pencil,
	Check,
	X,
	KeyRound,
	Globe,
	Link2,
	Plus,
} from "lucide-react";
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

const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(6, "Password must be at least 6 characters"),
		newPassword: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

const setPasswordSchema = z
	.object({
		newPassword: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type ProfileFormValues = z.infer<typeof profileSchema>;
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;

export default function ProfilePage() {
	const { user, isAuthenticated, isLoading: authLoading, checkAuth } = useAuth();
	const router = useRouter();

	const [activeTab, setActiveTab] = useState("profile");
	const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
	const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);

	// Connected accounts — we use a simple state approach since useListAccounts isn't available in this setup
	const [hasGoogleAccount] = useState(false);
	const [hasCredentialAccount] = useState(true);
	const accountsLoading = false;

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


	const handleLinkGoogle = async () => {
		setIsLinkingGoogle(true);
		try {
			await authClient.linkSocial({ provider: "google", callbackURL: "/profile" });
		} catch (err: any) {
			toast.error(err.message || "Failed to connect Google account");
			setIsLinkingGoogle(false);
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
		register: registerChangePassword,
		handleSubmit: handleChangePasswordSubmit,
		formState: { errors: changePasswordErrors },
		reset: resetChangePassword,
	} = useForm<ChangePasswordFormValues>({
		resolver: zodResolver(changePasswordSchema),
	});

	const {
		register: registerSetPassword,
		handleSubmit: handleSetPasswordSubmit,
		formState: { errors: setPasswordErrors },
		reset: resetSetPassword,
	} = useForm<SetPasswordFormValues>({
		resolver: zodResolver(setPasswordSchema),
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

	const onChangePasswordSubmit = async (data: ChangePasswordFormValues) => {
		setIsUpdatingPassword(true);
		try {
			await authApi.changePassword({
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
				revokeOtherSessions: true,
			});
			toast.success("Password changed successfully!");
			resetChangePassword();
		} catch (err: any) {
			toast.error(err.response?.data?.message || "Failed to change password");
		} finally {
			setIsUpdatingPassword(false);
		}
	};

	const onSetPasswordSubmit = async (data: SetPasswordFormValues) => {
		setIsUpdatingPassword(true);
		try {
			await authApi.changePassword({ currentPassword: '', newPassword: data.newPassword });
			toast.success("Password set successfully!");
			resetSetPassword();
			window.location.reload();
		} catch (err: any) {
			toast.error(err.message || "Failed to set password");
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
											<label className="text-sm font-medium text-gray-700">Full Name</label>
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
											<label className="text-sm font-medium text-gray-700">Email Address</label>
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
									className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-gray-100 space-y-10"
								>
									<div className="border-b border-gray-100 pb-6">
										<h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
											<Shield className="w-5 h-5 text-primary-600" />
											Security Settings
										</h2>
										<p className="text-sm text-gray-500 mt-1">Manage your password and authentication methods.</p>
									</div>

									{/* ── Password Section ── */}
									<div>
										<div className="flex items-center gap-2 mb-1">
											<KeyRound className="w-5 h-5 text-gray-700" />
											<h3 className="text-lg font-bold text-gray-900">
												{hasCredentialAccount ? "Change Password" : "Add Password"}
											</h3>
										</div>
										<p className="text-sm text-gray-500 mb-6">
											{hasCredentialAccount
												? "Update your current password to keep your account secure."
												: "You signed up with Google or Passkey. You can add a password to also sign in with email & password."}
										</p>

										{accountsLoading ? (
											<div className="flex items-center gap-2 text-gray-400 text-sm">
												<Loader2 className="w-4 h-4 animate-spin" /> Loading…
											</div>
										) : hasCredentialAccount ? (
											/* Change password form */
											<form
												onSubmit={handleChangePasswordSubmit(onChangePasswordSubmit)}
												className="space-y-5 max-w-xl"
											>
												<div className="space-y-1">
													<label className="text-sm font-medium text-gray-700">Current Password</label>
													<input
														{...registerChangePassword("currentPassword")}
														type="password"
														className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
													/>
													{changePasswordErrors.currentPassword && (
														<p className="text-sm text-red-600 mt-1">{changePasswordErrors.currentPassword.message}</p>
													)}
												</div>

												<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
													<div className="space-y-1">
														<label className="text-sm font-medium text-gray-700">New Password</label>
														<input
															{...registerChangePassword("newPassword")}
															type="password"
															className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
														/>
														{changePasswordErrors.newPassword && (
															<p className="text-sm text-red-600 mt-1">{changePasswordErrors.newPassword.message}</p>
														)}
													</div>
													<div className="space-y-1">
														<label className="text-sm font-medium text-gray-700">Confirm Password</label>
														<input
															{...registerChangePassword("confirmPassword")}
															type="password"
															className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
														/>
														{changePasswordErrors.confirmPassword && (
															<p className="text-sm text-red-600 mt-1">{changePasswordErrors.confirmPassword.message}</p>
														)}
													</div>
												</div>

												<div className="pt-2 flex justify-end">
													<button
														type="submit"
														disabled={isUpdatingPassword}
														className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm"
													>
														{isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
														Update Password
													</button>
												</div>
											</form>
										) : (
											/* Set password form (no current password needed) */
											<form
												onSubmit={handleSetPasswordSubmit(onSetPasswordSubmit)}
												className="space-y-5 max-w-xl"
											>
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
													<div className="space-y-1">
														<label className="text-sm font-medium text-gray-700">New Password</label>
														<input
															{...registerSetPassword("newPassword")}
															type="password"
															className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
														/>
														{setPasswordErrors.newPassword && (
															<p className="text-sm text-red-600 mt-1">{setPasswordErrors.newPassword.message}</p>
														)}
													</div>
													<div className="space-y-1">
														<label className="text-sm font-medium text-gray-700">Confirm Password</label>
														<input
															{...registerSetPassword("confirmPassword")}
															type="password"
															className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
														/>
														{setPasswordErrors.confirmPassword && (
															<p className="text-sm text-red-600 mt-1">{setPasswordErrors.confirmPassword.message}</p>
														)}
													</div>
												</div>
												<div className="pt-2 flex justify-end">
													<button
														type="submit"
														disabled={isUpdatingPassword}
														className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm"
													>
														{isUpdatingPassword ? (
															<Loader2 className="w-4 h-4 animate-spin" />
														) : (
															<Plus className="w-4 h-4" />
														)}
														Set Password
													</button>
												</div>
											</form>
										)}
									</div>



									{/* ── Connected Accounts Section ── */}
									<div className="border-t border-gray-100 pt-8">
										<div className="flex items-center gap-2 mb-1">
											<Link2 className="w-5 h-5 text-gray-700" />
											<h3 className="text-lg font-bold text-gray-900">Connected Accounts</h3>
										</div>
										<p className="text-sm text-gray-500 mb-5">
											Link external accounts to sign in faster.
										</p>

										{accountsLoading ? (
											<div className="flex items-center gap-2 text-gray-400 text-sm">
												<Loader2 className="w-4 h-4 animate-spin" /> Loading…
											</div>
										) : (
											<div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 max-w-xl">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
														{/* Google logo */}
														<svg className="w-5 h-5" viewBox="0 0 24 24">
															<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
															<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
															<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
															<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
														</svg>
													</div>
													<div>
														<p className="text-sm font-semibold text-gray-900">Google</p>
														<p className="text-xs text-gray-500">
															{hasGoogleAccount ? "Connected" : "Not connected"}
														</p>
													</div>
												</div>
												{hasGoogleAccount ? (
													<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
														Connected
													</span>
												) : (
													<button
														onClick={handleLinkGoogle}
														disabled={isLinkingGoogle}
														className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center gap-2 disabled:opacity-70 text-sm shadow-sm"
													>
														{isLinkingGoogle ? (
															<Loader2 className="w-4 h-4 animate-spin" />
														) : (
															<Link2 className="w-4 h-4" />
														)}
														Connect
													</button>
												)}
											</div>
										)}
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
										We'll be adding detailed notification settings soon. You'll be able to control email and push
										notifications here.
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
