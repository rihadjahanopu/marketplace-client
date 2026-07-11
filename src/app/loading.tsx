"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function Loading() {
	return (
		<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{
					duration: 0.3,
					repeat: Infinity,
					repeatType: "reverse",
					ease: "easeInOut",
				}}
				className="relative flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full shadow-lg"
			>
				<Search className="w-8 h-8 text-primary-600" />
				
				{/* Orbiting dots for extra modern feel */}
				<motion.div 
					animate={{ rotate: 360 }}
					transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
					className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 border-r-primary-500 opacity-50" 
				/>
			</motion.div>
			<motion.p
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="mt-6 text-gray-500 font-medium tracking-wide animate-pulse"
			>
				Loading Marketplace...
			</motion.p>
		</div>
	);
}
