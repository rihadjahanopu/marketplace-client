"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PageLoader() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		let timeout: NodeJS.Timeout;

		setLoading(true);
		setProgress(0);

		// Quickly jump to 70% then slow down (simulates real loading)
		interval = setInterval(() => {
			setProgress((prev) => {
				if (prev < 70) return prev + 12;
				if (prev < 90) return prev + 2;
				return prev;
			});
		}, 80);

		// Complete after a short delay
		timeout = setTimeout(() => {
			clearInterval(interval);
			setProgress(100);
			setTimeout(() => {
				setLoading(false);
				setProgress(0);
			}, 300);
		}, 600);

		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, [pathname, searchParams]);

	return (
		<AnimatePresence>
			{loading && (
				<motion.div
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="fixed top-0 left-0 right-0 z-9999 h-0.5">
					<motion.div
						className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-400 rounded-r-full shadow-sm"
						style={{ width: `${progress}%` }}
						transition={{ ease: "easeInOut", duration: 0.15 }}
					/>
					{/* Glowing dot at the tip */}
					<motion.div
						className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary-500 shadow-[0_0_8px_2px_rgba(99,102,241,0.7)]"
						style={{ left: `calc(${progress}% - 6px)` }}
						transition={{ ease: "easeInOut", duration: 0.15 }}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
