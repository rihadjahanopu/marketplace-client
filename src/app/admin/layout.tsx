"use client";

import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import {
	LayoutDashboard,
	Menu,
	Package,
	Shield,
	Users,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
	{ href: "/admin/users", label: "Manage Users", icon: Users },
	{ href: "/admin/items", label: "Manage Items", icon: Package },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const { user, isAuthenticated, isLoading } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
			router.push("/");
		}
	}, [isLoading, isAuthenticated, user, router]);

	if (isLoading || !isAuthenticated || user?.role !== "admin") return null;

	const currentPage = navItems.find((item) => item.href === pathname)?.label || "Admin Panel";

	return (
		<div className="pt-16 min-h-screen bg-gray-50 flex flex-col md:flex-row">

			{/* Mobile Top Bar */}
			<div className="md:hidden sticky top-16 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
				<div className="flex items-center gap-2">
					<div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
						<Shield className="w-3.5 h-3.5 text-white" />
					</div>
					<div>
						<p className="text-xs text-gray-500 leading-none">Admin Panel</p>
						<p className="text-sm font-bold text-gray-900 leading-tight">{currentPage}</p>
					</div>
				</div>
				<button
					onClick={() => setSidebarOpen(true)}
					className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
				>
					<Menu className="w-5 h-5 text-gray-700" />
				</button>
			</div>

			{/* Sidebar - Desktop */}
			<aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-4rem)] sticky top-16 self-start">
				<div className="p-6 border-b border-gray-100">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
							<Shield className="w-4 h-4 text-white" />
						</div>
						<div>
							<p className="text-sm font-bold text-gray-900">Admin Panel</p>
							<p className="text-xs text-gray-500">{user.email}</p>
						</div>
					</div>
				</div>

				<nav className="flex-1 p-4 space-y-1">
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
									isActive
										? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-sm"
										: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
								}`}
							>
								<item.icon className="w-4 h-4" />
								{item.label}
							</Link>
						);
					})}
				</nav>

				<div className="p-4 border-t border-gray-100">
					<Link
						href="/dashboard"
						className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
					>
						<LayoutDashboard className="w-4 h-4" />
						Back to Dashboard
					</Link>
				</div>
			</aside>

			{/* Mobile Sidebar Drawer */}
			<AnimatePresence>
				{sidebarOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/40 z-40 md:hidden"
							onClick={() => setSidebarOpen(false)}
						/>
						<motion.aside
							initial={{ x: -280 }}
							animate={{ x: 0 }}
							exit={{ x: -280 }}
							transition={{ type: "spring", damping: 20 }}
							className="fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col shadow-2xl"
						>
							<div className="p-4 border-b border-gray-100 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
										<Shield className="w-4 h-4 text-white" />
									</div>
									<div>
										<p className="font-bold text-gray-900">Admin Panel</p>
										<p className="text-xs text-gray-500 truncate max-w-[150px]">{user.email}</p>
									</div>
								</div>
								<button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
									<X className="w-5 h-5" />
								</button>
							</div>

							<nav className="flex-1 p-4 space-y-1">
								{navItems.map((item) => {
									const isActive = pathname === item.href;
									return (
										<Link
											key={item.href}
											href={item.href}
											onClick={() => setSidebarOpen(false)}
											className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
												isActive
													? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-sm"
													: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
											}`}
										>
											<item.icon className="w-4 h-4" />
											{item.label}
										</Link>
									);
								})}
							</nav>

							<div className="p-4 border-t border-gray-100">
								<Link
									href="/dashboard"
									onClick={() => setSidebarOpen(false)}
									className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
								>
									<LayoutDashboard className="w-4 h-4" />
									Back to Dashboard
								</Link>
							</div>
						</motion.aside>
					</>
				)}
			</AnimatePresence>

			{/* Main Content */}
			<main className="flex-1 overflow-auto min-w-0">
				{children}
			</main>
		</div>
	);
}
