"use client";

import { ItemCard } from "@/components/ItemCard";
import { ItemCardSkeleton } from "@/components/ItemCardSkeleton";
import { itemsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function FeaturedProductsSection() {
	const { data, isLoading } = useQuery({
		queryKey: ["featured-items"],
		queryFn: () => itemsApi.getItems({ limit: 6 }),
	});

	const items = data?.items || [];

	return (
		<section className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
							<Sparkles className="w-8 h-8 text-primary-500" />
							Featured Products
						</h2>
						<p className="text-gray-600">
							Discover our top picks and most popular items.
						</p>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
					>
						<Link
							href="/explore"
							className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border border-gray-200 font-semibold rounded-xl hover:bg-gray-50 hover:text-primary-600 transition-all card-shadow hover:-translate-y-0.5"
						>
							View More
							<ArrowRight className="w-5 h-5" />
						</Link>
					</motion.div>
				</div>

				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{Array.from({ length: 6 }).map((_, i) => (
							<ItemCardSkeleton key={i} />
						))}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{items.map((item, i) => (
							<motion.div
								key={item._id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
							>
								<ItemCard item={item} viewMode="grid" />
							</motion.div>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
