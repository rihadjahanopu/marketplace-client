"use client";

import { useAuth } from "@/contexts/AuthContext";
import { itemsApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
	ArrowDownRight,
	ArrowUpRight,
	DollarSign,
	LayoutDashboard,
	Loader2,
	Package,
	TrendingUp,
	Shield,
	Users,
	Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const COLORS = [
	"#3b82f6",
	"#c026d3",
	"#22c55e",
	"#f59e0b",
	"#ef4444",
	"#06b6d4",
	"#8b5cf6",
	"#ec4899",
	"#6b7280",
];

export default function DashboardPage() {
	const { user, isAuthenticated, isLoading: authLoading } = useAuth();
	const router = useRouter();

	const { data: statsData, isLoading: statsLoading } = useQuery({
		queryKey: ["stats"],
		queryFn: itemsApi.getStats,
		enabled: isAuthenticated,
	});

	const { data: myItemsData } = useQuery({
		queryKey: ["my-items"],
		queryFn: itemsApi.getMyItems,
		enabled: isAuthenticated,
	});

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [authLoading, isAuthenticated, router]);

	if (authLoading) {
		return (
			<div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary-600" />
			</div>
		);
	}

	if (!isAuthenticated) return null;

	const stats = statsData?.stats;
	const myItems = myItemsData?.items || [];
	const totalValue = myItems.reduce(
		(sum: number, item: any) => sum + item.price,
		0
	);

	const categoryChartData =
		stats?.categoryStats?.map((cat: any) => ({
			name: cat._id,
			value: cat.count,
		})) || [];

	const monthlyChartData =
		stats?.monthlyStats?.map((m: any) => ({
			month: m._id.slice(5),
			listings: m.count,
		})) || [];

	const statCards = [
		{
			title: "My Listings",
			value: myItems.length,
			icon: Package,
			change: "+12%",
			positive: true,
		},
		{
			title: "Total Value",
			value: formatPrice(totalValue),
			icon: DollarSign,
			change: "+8%",
			positive: true,
		},
		{
			title: "Avg. Price",
			value: formatPrice(myItems.length ? totalValue / myItems.length : 0),
			icon: TrendingUp,
			change: "-3%",
			positive: false,
		},
		{
			title: "Total Listings",
			value: stats?.totalItems?.toLocaleString() || 0,
			icon: LayoutDashboard,
			change: "+24%",
			positive: true,
		},
	];

	return (
		<div className="pt-24 pb-16 min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}>
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
							Dashboard
							{user?.role === "admin" && (
								<span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full flex items-center gap-1">
									<Shield className="w-4 h-4" />
									Admin
								</span>
							)}
						</h1>
						<p className="text-gray-600 mt-2">
							Welcome back, <span className="font-medium text-gray-900">{user?.name}</span>! Here is what is happening with your
							listings.
						</p>
					</div>

					{/* Stat Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
						{statCards.map((card, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: i * 0.1 }}
								className="bg-white rounded-2xl p-5 card-shadow">
								<div className="flex items-center justify-between mb-3">
									<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
										<card.icon className="w-5 h-5 text-primary-600" />
									</div>
									<span
										className={`flex items-center gap-0.5 text-xs font-medium ${
											card.positive ? "text-green-600" : "text-red-600"
										}`}>
										{card.positive ?
											<ArrowUpRight className="w-3.5 h-3.5" />
										:	<ArrowDownRight className="w-3.5 h-3.5" />}
										{card.change}
									</span>
								</div>
								<p className="text-2xl font-bold text-gray-900">{card.value}</p>
								<p className="text-sm text-gray-500 mt-0.5">{card.title}</p>
							</motion.div>
						))}
					</div>

					{/* Charts Row */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
						{/* Monthly Listings Chart */}
						<div className="bg-white rounded-2xl p-6 card-shadow">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Listings Over Time
							</h3>
							<ResponsiveContainer
								width="100%"
								height={280}>
								<LineChart data={monthlyChartData}>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="#f0f0f0"
									/>
									<XAxis
										dataKey="month"
										stroke="#9ca3af"
										fontSize={12}
									/>
									<YAxis
										stroke="#9ca3af"
										fontSize={12}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: "white",
											border: "1px solid #e5e7eb",
											borderRadius: "12px",
											boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
										}}
									/>
									<Line
										type="monotone"
										dataKey="listings"
										stroke="#3b82f6"
										strokeWidth={2}
										dot={{ fill: "#3b82f6", r: 4 }}
										activeDot={{ r: 6 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>

						{/* Category Distribution */}
						<div className="bg-white rounded-2xl p-6 card-shadow">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Category Distribution
							</h3>
							<ResponsiveContainer
								width="100%"
								height={280}>
								<PieChart>
									<Pie
										data={categoryChartData}
										cx="50%"
										cy="50%"
										innerRadius={60}
										outerRadius={100}
										paddingAngle={2}
										dataKey="value">
										{categoryChartData.map((_: unknown, index: number) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip
										contentStyle={{
											backgroundColor: "white",
											border: "1px solid #e5e7eb",
											borderRadius: "12px",
										}}
									/>
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Category Bar Chart */}
					<div className="bg-white rounded-2xl p-6 card-shadow mb-8">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Items by Category
						</h3>
						<ResponsiveContainer
							width="100%"
							height={300}>
							<BarChart data={categoryChartData}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#f0f0f0"
								/>
								<XAxis
									dataKey="name"
									stroke="#9ca3af"
									fontSize={11}
									angle={-45}
									textAnchor="end"
									height={80}
								/>
								<YAxis
									stroke="#9ca3af"
									fontSize={12}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "white",
										border: "1px solid #e5e7eb",
										borderRadius: "12px",
										boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
									}}
								/>
								<Bar
									dataKey="value"
									fill="#3b82f6"
									radius={[8, 8, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>

					{/* Quick Actions */}
					<div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
						<h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
						<div className="flex flex-wrap gap-3">
							<Link
								href="/items/add"
								className="px-4 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-sm font-medium flex items-center gap-2">
								<Package className="w-4 h-4" />
								Add New Item
							</Link>
							<Link
								href="/items/manage"
								className="px-4 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-sm font-medium flex items-center gap-2">
								<LayoutDashboard className="w-4 h-4" />
								Manage Items
							</Link>
							<Link
								href="/explore"
								className="px-4 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-sm font-medium flex items-center gap-2">
								<TrendingUp className="w-4 h-4" />
								Explore Market
							</Link>
						</div>
					</div>

					{/* Admin Section */}
					{user?.role === "admin" && (
						<div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white card-shadow">
							<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
								<Shield className="w-5 h-5 text-red-400" />
								Admin Controls
							</h3>
							<div className="flex flex-wrap gap-3">
								<Link
									href="/admin/users"
									className="px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 border border-white/10 transition-colors text-sm font-medium flex items-center gap-2">
									<Users className="w-4 h-4" />
									Manage Users
								</Link>
								<Link
									href="/admin/items"
									className="px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 border border-white/10 transition-colors text-sm font-medium flex items-center gap-2">
									<Settings className="w-4 h-4" />
									Moderate All Items
								</Link>
							</div>
						</div>
					)}
				</motion.div>
			</div>
		</div>
	);
}
