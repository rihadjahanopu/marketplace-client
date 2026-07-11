"use client";

import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import {
	ChevronDown,
	LayoutDashboard,
	List,
	LogOut,
	Menu,
	PlusCircle,
	Store,
	User as UserIcon,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar() {
	const { user, isAuthenticated, logout, isLoading } = useAuth();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const pathname = usePathname();

	const publicLinks = [
		{ href: "/", label: "Home" },
		{ href: "/explore", label: "Explore" },
		{ href: "/about", label: "About" },
	];

	const authLinks = [
		{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
		{ href: "/items/add", label: "Add Item", icon: PlusCircle },
		{ href: "/items/manage", label: "Manage Items", icon: List },
	];

	const isActive = (href: string) => {
		if (href === "/") return pathname === "/";
		return pathname.startsWith(href);
	};

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center gap-2 group">
						<div className="w-9 h-9 rounded-lg bg-linear-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
							<Store className="w-5 h-5 text-white" />
						</div>
						<span className="text-xl font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
							MarketPlace
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-1">
						{publicLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
									isActive(link.href) ?
										"text-primary-600 bg-primary-50"
									:	"text-gray-600 hover:text-gray-900 hover:bg-gray-50"
								}`}>
								{link.label}
							</Link>
						))}
						{isAuthenticated &&
							authLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
										isActive(link.href) ?
											"text-primary-600 bg-primary-50"
										:	"text-gray-600 hover:text-gray-900 hover:bg-gray-50"
									}`}>
									{link.label}
								</Link>
							))}
					</div>

					{/* Auth Buttons */}
					<div className="hidden md:flex items-center gap-3">
						{isLoading ?
							<div className="w-20 h-8 bg-gray-100 animate-pulse rounded-lg" />
						: isAuthenticated ?
							<div className="relative">
								<button
									onClick={() => setProfileOpen(!profileOpen)}
									className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
									<div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center overflow-hidden">
										{user?.image ? (
											<img src={user.image} alt={user.name} className="w-full h-full object-cover" />
										) : (
											<span className="text-white text-sm font-medium">
												{user?.name?.charAt(0).toUpperCase()}
											</span>
										)}
									</div>
									<span className="text-sm font-medium text-gray-700">
										{user?.name}
									</span>
									<ChevronDown className="w-4 h-4 text-gray-400" />
								</button>
								<AnimatePresence>
									{profileOpen && (
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: 10 }}
											className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1">
											<div className="px-4 py-2 border-b border-gray-100">
												<p className="text-sm font-medium text-gray-900">
													{user?.name}
												</p>
												<p className="text-xs text-gray-500">{user?.email}</p>
											</div>
											<Link
												href="/profile"
												onClick={() => setProfileOpen(false)}
												className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
												<UserIcon className="w-4 h-4" />
												Profile Settings
											</Link>
											<button
												onClick={() => {
													logout();
													setProfileOpen(false);
												}}
												className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
												<LogOut className="w-4 h-4" />
												Sign Out
											</button>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						:	<>
								<Link
									href="/login"
									className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
									Sign In
								</Link>
								<Link
									href="/register"
									className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-primary-600 to-secondary-600 rounded-lg hover:opacity-90 transition-opacity">
									Get Started
								</Link>
							</>
						}
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setMobileOpen(!mobileOpen)}
						className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
						{mobileOpen ?
							<X className="w-6 h-6" />
						:	<Menu className="w-6 h-6" />}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{mobileOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="md:hidden bg-white border-t border-gray-100 overflow-hidden">
						<div className="px-4 py-3 space-y-1">
							{publicLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setMobileOpen(false)}
									className={`block px-3 py-2 rounded-lg text-sm font-medium ${
										isActive(link.href) ?
											"text-primary-600 bg-primary-50"
										:	"text-gray-600 hover:bg-gray-50"
									}`}>
									{link.label}
								</Link>
							))}
							{isAuthenticated &&
								authLinks.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										onClick={() => setMobileOpen(false)}
										className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
											isActive(link.href) ?
												"text-primary-600 bg-primary-50"
											:	"text-gray-600 hover:bg-gray-50"
										}`}>
										<link.icon className="w-4 h-4" />
										{link.label}
									</Link>
								))}
							{isAuthenticated && (
								<Link
									href="/profile"
									onClick={() => setMobileOpen(false)}
									className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
										isActive("/profile") ?
											"text-primary-600 bg-primary-50"
										:	"text-gray-600 hover:bg-gray-50"
									}`}>
									<UserIcon className="w-4 h-4" />
									Profile Settings
								</Link>
							)}
							{isAuthenticated ?
								<button
									onClick={() => {
										logout();
										setMobileOpen(false);
									}}
									className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
									<LogOut className="w-4 h-4" />
									Sign Out
								</button>
							:	<div className="pt-2 space-y-2">
									<Link
										href="/login"
										onClick={() => setMobileOpen(false)}
										className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg">
										Sign In
									</Link>
									<Link
										href="/register"
										onClick={() => setMobileOpen(false)}
										className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-primary-600 to-secondary-600 rounded-lg">
										Get Started
									</Link>
								</div>
							}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}
