"use client";

import { useAuth } from "@/contexts/AuthContext";
import { itemsApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
	AlertCircle,
	ArrowLeft,
	Calendar,
	Edit,
	Loader2,
	Mail,
	MapPin,
	Star,
	Tag,
	Send,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ItemDetailPage() {
	const { id } = useParams();
	const router = useRouter();
	const { user } = useAuth();
	const [selectedImage, setSelectedImage] = useState(0);
	const [activeTab, setActiveTab] = useState(0);
	const [reviewRating, setReviewRating] = useState(5);
	const [reviewComment, setReviewComment] = useState("");
	const [isSubmittingReview, setIsSubmittingReview] = useState(false);

	const { data, isLoading, error, refetch: refetchItem } = useQuery({
		queryKey: ["item", id],
		queryFn: () => itemsApi.getItem(id as string),
	});

	const { data: relatedData } = useQuery({
		queryKey: ["related-items", data?.item?.category],
		queryFn: () =>
			itemsApi.getItems({
				category: data?.item?.category ?? undefined,
				limit: 4,
			}),
		enabled: !!data?.item?.category,
	});

	const { data: reviewsData, refetch: refetchReviews } = useQuery({
		queryKey: ["item-reviews", id],
		queryFn: () => itemsApi.getItemReviews(id as string),
	});

	const handleReviewSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!reviewComment.trim()) return;
		setIsSubmittingReview(true);
		try {
			await itemsApi.addReview(id as string, {
				rating: reviewRating,
				comment: reviewComment,
			});
			toast.success("Review added successfully");
			setReviewComment("");
			refetchReviews();
			refetchItem(); // to update overall rating
		} catch (err: any) {
			toast.error(err.response?.data?.message || "Failed to add review");
		} finally {
			setIsSubmittingReview(false);
		}
	};

	if (isLoading) {
		return (
			<div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary-600" />
			</div>
		);
	}

	if (error || !data?.item) {
		return (
			<div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
				<div className="text-center">
					<AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Item not found
					</h2>
					<p className="text-gray-600 mb-4">
						The item you are looking for does not exist.
					</p>
					<button
						onClick={() => router.push("/explore")}
						className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
						Browse Items
					</button>
				</div>
			</div>
		);
	}

	const item = data.item;
	const creatorId = item.createdBy && typeof item.createdBy === 'object' ? item.createdBy._id || (item.createdBy as any).id : item.createdBy;
	const isOwner = user?.id === creatorId;
	
	const images =
		item.images?.length ?
			item.images
		:	[
				"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
			];
	const relatedItems =
		relatedData?.items?.filter((r) => r._id !== item._id) || [];
	const reviews = reviewsData?.reviews || [];

	const tabs = [
		{ label: "Overview", content: item.description },
		{
			label: "Specifications",
			content:
				item.specifications?.length ?
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{item.specifications.map((spec, i) => (
							<div
								key={i}
								className="flex justify-between p-3 bg-gray-50 rounded-lg">
								<span className="text-sm text-gray-600">{spec.key}</span>
								<span className="text-sm font-medium text-gray-900">
									{spec.value}
								</span>
							</div>
						))}
					</div>
				:	<p className="text-gray-500">No specifications available.</p>,
		},
		{
			label: "Reviews",
			content: (
				<div className="space-y-6">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-gray-100">
						<div className="text-center min-w-[100px]">
							<p className="text-4xl font-bold text-gray-900">
								{(item.rating || 0).toFixed(1)}
							</p>
							<div className="flex gap-0.5 mt-2 justify-center">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star
										key={i}
										className={`w-4 h-4 ${i < Math.round(item.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
									/>
								))}
							</div>
							<p className="text-xs text-gray-500 mt-2">
								{item.reviewCount || 0} reviews
							</p>
						</div>
						
						{/* Review Form */}
						{user && !isOwner && (
							<div className="flex-1 w-full">
								<h4 className="text-sm font-semibold text-gray-900 mb-2">Write a Review</h4>
								<form onSubmit={handleReviewSubmit} className="space-y-3">
									<div className="flex gap-1">
										{Array.from({ length: 5 }).map((_, i) => (
											<button
												key={i}
												type="button"
												onClick={() => setReviewRating(i + 1)}
												className="focus:outline-none"
											>
												<Star className={`w-5 h-5 ${i < reviewRating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
											</button>
										))}
									</div>
									<div className="flex gap-2">
										<input
											type="text"
											placeholder="Share your thoughts..."
											value={reviewComment}
											onChange={(e) => setReviewComment(e.target.value)}
											className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
										/>
										<button
											type="submit"
											disabled={isSubmittingReview || !reviewComment.trim()}
											className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center"
										>
											{isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
										</button>
									</div>
								</form>
							</div>
						)}
					</div>

					{/* Review List */}
					<div className="space-y-4">
						{reviews.length > 0 ? (
							reviews.map((review) => (
								<div key={review._id} className="p-4 bg-gray-50 rounded-xl">
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center gap-2">
											<div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">
												{review.user?.name?.charAt(0) || "U"}
											</div>
											<div>
												<p className="text-sm font-semibold text-gray-900">{review.user?.name || "Unknown"}</p>
												<p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
											</div>
										</div>
										<div className="flex gap-0.5">
											{Array.from({ length: 5 }).map((_, i) => (
												<Star
													key={i}
													className={`w-3 h-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
												/>
											))}
										</div>
									</div>
									<p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
								</div>
							))
						) : (
							<p className="text-gray-500">
								No reviews yet. Be the first to leave a review!
							</p>
						)}
					</div>
				</div>
			),
		},
	];

	return (
		<div className="pt-24 pb-16 min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Back button */}
				<motion.button
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					onClick={() => router.back()}
					className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
					<ArrowLeft className="w-4 h-4" />
					Back to results
				</motion.button>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Image Gallery */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="lg:col-span-2">
						<div className="bg-white rounded-2xl overflow-hidden card-shadow">
							<div className="relative aspect-[16/10]">
								<Image
									src={images[selectedImage]}
									alt={item.title}
									fill
									className="object-cover"
									priority
								/>
							</div>
							{images.length > 1 && (
								<div className="flex gap-2 p-4 overflow-x-auto">
									{images.map((img, i) => (
										<button
											key={i}
											onClick={() => setSelectedImage(i)}
											className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
												selectedImage === i ? "border-primary-500" : (
													"border-transparent"
												)
											}`}>
											<Image
												src={img}
												alt={`${item.title} ${i + 1}`}
												fill
												className="object-cover"
											/>
										</button>
									))}
								</div>
							)}
						</div>

						{/* Tabs */}
						<div className="mt-6 bg-white rounded-2xl card-shadow overflow-hidden">
							<div className="flex border-b border-gray-100">
								{tabs.map((tab, i) => (
									<button
										key={i}
										onClick={() => setActiveTab(i)}
										className={`px-5 py-3 text-sm font-medium transition-colors ${
											activeTab === i ?
												"text-primary-600 border-b-2 border-primary-600"
											:	"text-gray-500 hover:text-gray-700"
										}`}>
										{tab.label}
									</button>
								))}
							</div>
							<div className="p-5">
								{typeof tabs[activeTab].content === "string" ?
									<p className="text-gray-700 leading-relaxed whitespace-pre-line">
										{tabs[activeTab].content}
									</p>
								:	tabs[activeTab].content}
							</div>
						</div>
					</motion.div>

					{/* Sidebar */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="space-y-6">
						{/* Price Card */}
						<div className="bg-white rounded-2xl p-6 card-shadow">
							<div className="flex items-center gap-2 mb-2">
								<span
									className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
										item.status === "active" ?
											"bg-green-100 text-green-700"
										:	"bg-gray-100 text-gray-700"
									}`}>
									{item.status}
								</span>
								<span className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-medium">
									{item.category}
								</span>
							</div>
							<h1 className="text-2xl font-bold text-gray-900 mb-2">
								{item.title}
							</h1>
							<p className="text-3xl font-bold text-primary-600 mb-4">
								{formatPrice(item.price)}
							</p>
							<p className="text-sm text-gray-600 mb-4">
								{item.shortDescription}
							</p>
							<div className="space-y-2 text-sm text-gray-600">
								<div className="flex items-center gap-2">
									<MapPin className="w-4 h-4 text-gray-400" />
									{item.location}
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="w-4 h-4 text-gray-400" />
									Listed on {formatDate(item.createdAt)}
								</div>
								<div className="flex items-center gap-2">
									<Tag className="w-4 h-4 text-gray-400" />
									Priority: <span className="capitalize">{item.priority}</span>
								</div>
							</div>
						</div>

						{/* Seller Card */}
						<div className="bg-white rounded-2xl p-6 card-shadow">
							<h3 className="font-semibold text-gray-900 mb-3">
								Seller Information
							</h3>
							<div className="flex items-center gap-3 mb-3">
								<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
									<span className="text-white font-medium">
										{item.createdBy && typeof item.createdBy === "object" ?
											item.createdBy.name?.charAt(0) || "U"
										:	"U"}
									</span>
								</div>
								<div>
									<p className="font-medium text-gray-900">
										{item.createdBy && typeof item.createdBy === "object" ?
											item.createdBy.name || "Unknown"
										:	"Unknown"}
									</p>
									<p className="text-xs text-gray-500">
										Member since{" "}
										{item.createdBy && typeof item.createdBy === "object" && item.createdBy.createdAt ?
											formatDate(item.createdBy.createdAt)
										:	"N/A"}
									</p>
									{item.createdBy && typeof item.createdBy === "object" && item.createdBy.email && (
										<p className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px] sm:max-w-[200px]">
											{item.createdBy.email}
										</p>
									)}
								</div>
							</div>
							{!isOwner && (
								<a 
									href={`mailto:${item.createdBy && typeof item.createdBy === "object" ? item.createdBy.email || "" : ""}`}
									className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
								>
									<Mail className="w-4 h-4" />
									Contact Seller
								</a>
							)}
							{isOwner && (
								<button onClick={() => router.push(`/items/edit/${id}`)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium">
									<Edit className="w-4 h-4" />
									Edit Item
								</button>
							)}
						</div>
					</motion.div>
				</div>

				{/* Related Items */}
				{relatedItems.length > 0 && (
					<div className="mt-12">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">
							Related Items
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{relatedItems.map((item) => (
								<Link
									key={item._id}
									href={`/items/${item._id}`}
									className="group block bg-white rounded-2xl overflow-hidden card-shadow hover-lift">
									<div className="relative aspect-[4/3]">
										<Image
											src={
												item.images?.[0] ||
												"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
											}
											alt={item.title}
											fill
											className="object-cover group-hover:scale-105 transition-transform"
										/>
									</div>
									<div className="p-4">
										<h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
											{item.title}
										</h3>
										<p className="text-primary-600 font-bold mt-1">
											{formatPrice(item.price)}
										</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
