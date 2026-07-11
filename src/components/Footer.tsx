"use client";

import {
	ArrowUp,
	Globe2,
	Mail,
	MapPin,
	MessageCircle,
	Phone,
	Send,
	Store,
} from "lucide-react";
import Link from "next/link";

export function Footer() {
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<footer className="bg-gray-900 text-gray-300">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Main Footer */}
				<div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand */}
					<div className="space-y-4">
						<Link
							href="/"
							className="flex items-center gap-2 group">
							<div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
								<Store className="w-5 h-5 text-white" />
							</div>
							<span className="text-xl font-bold text-white">MarketPlace</span>
						</Link>
						<p className="text-sm text-gray-400 leading-relaxed">
							Your trusted marketplace for buying and selling quality items.
							Connect with sellers and find exactly what you need.
						</p>
						<div className="flex gap-3">
							{[Globe2, MessageCircle, Send, Mail].map((Icon, i) => (
								<a
									key={i}
									href="#"
									className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
									<Icon className="w-4 h-4" />
								</a>
							))}
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-white font-semibold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							{[
								{ href: "/", label: "Home" },
								{ href: "/explore", label: "Explore Items" },
								{ href: "/about", label: "About Us" },
								{ href: "/contact", label: "Contact" },
								{ href: "/dashboard", label: "Dashboard" },
							].map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm hover:text-primary-400 transition-colors">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Categories */}
					<div>
						<h3 className="text-white font-semibold mb-4">Categories</h3>
						<ul className="space-y-2">
							{[
								"Electronics",
								"Vehicles",
								"Real Estate",
								"Fashion",
								"Home & Garden",
								"Sports",
							].map((cat) => (
								<li key={cat}>
									<Link
										href={`/explore?category=${cat}`}
										className="text-sm hover:text-primary-400 transition-colors">
										{cat}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="text-white font-semibold mb-4">Contact Us</h3>
						<ul className="space-y-3">
							<li className="flex items-center gap-3 text-sm">
								<Mail className="w-4 h-4 text-primary-400" />
								support@marketplace.com
							</li>
							<li className="flex items-center gap-3 text-sm">
								<Phone className="w-4 h-4 text-primary-400" />
								+1 (555) 123-4567
							</li>
							<li className="flex items-start gap-3 text-sm">
								<MapPin className="w-4 h-4 text-primary-400 mt-0.5" />
								123 Market Street, San Francisco, CA 94105
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="py-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-sm text-gray-500">
						&copy; {new Date().getFullYear()} MarketPlace. All rights reserved.
					</p>
					<div className="flex items-center gap-4 text-sm text-gray-500">
						<Link
							href="/privacy"
							className="hover:text-gray-300 transition-colors">
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							className="hover:text-gray-300 transition-colors">
							Terms of Service
						</Link>
						<button
							onClick={scrollToTop}
							className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
							<ArrowUp className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
