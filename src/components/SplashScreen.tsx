"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export function SplashScreen() {
	const [visible, setVisible] = useState(true);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		// Hide splash after animation completes
		const timer = setTimeout(() => setVisible(false), 2400);
		return () => clearTimeout(timer);
	}, []);

	// Don't block server render
	if (!mounted) return null;

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					initial={{ opacity: 1 }}
					exit={{ opacity: 0, scale: 1.05 }}
					transition={{ duration: 0.5, ease: "easeInOut" }}
					className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white">
					{/* Background radial glow */}
					<motion.div
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 0.15, scale: 2 }}
						transition={{ duration: 1.2, ease: "easeOut" }}
						className="absolute w-96 h-96 rounded-full bg-primary-500 blur-3xl pointer-events-none"
					/>

					{/* Logo Icon */}
					<motion.div
						initial={{ scale: 0, rotate: -20, opacity: 0 }}
						animate={{ scale: 1, rotate: 0, opacity: 1 }}
						transition={{
							type: "spring",
							stiffness: 260,
							damping: 18,
							delay: 0.1,
						}}
						className="relative w-24 h-24 bg-linear-to-br from-primary-500 to-secondary-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6">
						<ShoppingBag
							className="w-12 h-12 text-white"
							strokeWidth={1.5}
						/>

						{/* Ping ring effect */}
						<motion.span
							animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
							transition={{
								duration: 1,
								repeat: Infinity,
								ease: "easeOut",
								delay: 0.6,
							}}
							className="absolute inset-0 rounded-3xl bg-primary-400"
						/>
					</motion.div>

					{/* Brand Name */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className="text-center">
						<h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
							Market
							<span className="bg-linear-to-r from-primary-500 to-secondary-600 bg-clip-text text-transparent">
								Place
							</span>
						</h1>
						<p className="mt-2 text-sm text-gray-400 font-medium tracking-widest uppercase">
							Buy · Sell · Discover
						</p>
					</motion.div>

					{/* Loading dots */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8 }}
						className="mt-12 flex gap-2">
						{[0, 1, 2].map((i) => (
							<motion.span
								key={i}
								animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
								transition={{
									duration: 0.7,
									repeat: Infinity,
									ease: "easeInOut",
									delay: i * 0.15,
								}}
								className="w-2 h-2 rounded-full bg-primary-500 inline-block"
							/>
						))}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
