"use client";

import { motion } from "framer-motion";
import { ArrowRight, Search, Shield, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
	{
		title: "Buy & Sell with Confidence",
		description:
			"Discover thousands of quality items from trusted sellers. Your secure marketplace for everything you need.",
		gradient: "from-primary-600 via-primary-500 to-secondary-500",
	},
	{
		title: "Find Exactly What You Need",
		description:
			"From electronics to real estate, explore a vast collection of items across multiple categories.",
		gradient: "from-secondary-600 via-secondary-500 to-primary-500",
	},
	{
		title: "Start Selling Today",
		description:
			"List your items in minutes and reach thousands of potential buyers. Simple, fast, and secure.",
		gradient: "from-accent-600 via-accent-500 to-primary-500",
	},
];

export function HeroSection() {
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		const timer = setInterval(
			() => setCurrent((p) => (p + 1) % slides.length),
			5000
		);
		return () => clearInterval(timer);
	}, []);

	return (
		<section className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
			{/* Animated Background */}
			<div className="absolute inset-0">
				{slides.map((slide, i) => (
					<motion.div
						key={i}
						initial={false}
						animate={{ opacity: current === i ? 1 : 0 }}
						transition={{ duration: 0.8 }}
						className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
					/>
				))}
				<div className="absolute inset-0 bg-black/20" />
				{/* Pattern overlay */}
				<div
					className="absolute inset-0 opacity-10"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
					}}
				/>
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
				<div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_420px] items-center">
					<div className="rounded-[2rem] p-8 sm:p-10">
						<motion.div
							key={current}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}>
							<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
								{slides[current].title}
							</h1>
							<p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
								{slides[current].description}
							</p>
						</motion.div>

						<div className="flex flex-col sm:flex-row gap-4">
							<Link
								href="/explore"
								className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-lg">
								<Search className="w-5 h-5" />
								Explore Items
							</Link>
							<Link
								href="/items/add"
								className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all backdrop-blur-sm border border-white/30">
								Start Selling
								<ArrowRight className="w-5 h-5" />
							</Link>
						</div>

						<div className="flex gap-2 mt-8">
							{slides.map((_, i) => (
								<button
									key={i}
									onClick={() => setCurrent(i)}
									className={`h-2 rounded-full transition-all ${
										current === i ? "w-8 bg-white" : "w-2 bg-white/50"
									}`}
								/>
							))}
						</div>
					</div>
					{/* Floating Stats */}
					<div className="hidden lg:flex flex-col gap-4 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl p-5">
						{[
							{ icon: TrendingUp, label: "Active Listings", value: "12K+" },
							{ icon: Shield, label: "Verified Sellers", value: "8K+" },
							{ icon: Zap, label: "Daily Sales", value: "2K+" },
						].map((stat, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 24 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.35 + i * 0.08 }}
								className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/10 px-5 py-4 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.6)]">
								<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white shadow-inner">
									<stat.icon className="w-5 h-5" />
								</div>
								<div>
									<p className="text-white font-semibold text-lg">
										{stat.value}
									</p>
									<p className="text-white/75 text-sm">{stat.label}</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
