"use client";

import { motion } from "framer-motion";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
	const router = useRouter();

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-center"
			>
				<motion.div
					initial={{ scale: 0.8 }}
					animate={{ scale: 1 }}
					transition={{
						type: "spring",
						stiffness: 260,
						damping: 20,
						delay: 0.1,
					}}
					className="w-32 h-32 mx-auto bg-primary-50 rounded-full flex items-center justify-center mb-8 shadow-sm"
				>
					<FileQuestion className="w-16 h-16 text-primary-500" />
				</motion.div>
				
				<h1 className="text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
					404
				</h1>
				<h2 className="text-2xl font-bold text-gray-800 mb-3">
					Page Not Found
				</h2>
				<p className="text-gray-500 max-w-md mx-auto mb-10 text-lg">
					Oops! It seems you've ventured into unknown territory. The page you are looking for does not exist or has been moved.
				</p>

				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					<button
						onClick={() => router.back()}
						className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
					>
						<ArrowLeft className="w-4 h-4" />
						Go Back
					</button>
					<Link
						href="/"
						className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-all shadow-sm"
					>
						<Home className="w-4 h-4" />
						Return Home
					</Link>
				</div>
			</motion.div>
		</div>
	);
}
