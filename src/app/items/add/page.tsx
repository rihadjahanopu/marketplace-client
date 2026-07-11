"use client";

import { useAuth } from "@/contexts/AuthContext";
import { itemsApi, authApi } from "@/lib/api";
import type { ItemFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, ImagePlus, Loader2, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";

const itemSchema = z.object({
	title: z
		.string()
		.min(3, "Title must be at least 3 characters")
		.max(100, "Title cannot exceed 100 characters"),
	shortDescription: z
		.string()
		.min(10, "Short description must be at least 10 characters")
		.max(200, "Cannot exceed 200 characters"),
	description: z.string().min(20, "Description must be at least 20 characters"),
	category: z.string().min(1, "Please select a category"),
	price: z.coerce.number().min(0, "Price cannot be negative"),
	date: z.string().min(1, "Please select a date"),
	priority: z.enum(["low", "medium", "high"]),
	location: z.string().min(2, "Location is required"),
	images: z.array(z.string()).optional(),
	specifications: z
		.array(
			z.object({
				key: z.string().min(1, "Key is required"),
				value: z.string().min(1, "Value is required"),
			})
		)
		.optional(),
});

type ItemFormValues = z.output<typeof itemSchema>;
type ItemFormInput = z.input<typeof itemSchema>;

export default function AddItemPage() {
	const { isAuthenticated, isLoading: authLoading } = useAuth();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [previewUrls, setPreviewUrls] = useState<string[]>([]);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files);
			if (selectedFiles.length + filesArray.length > 5) {
				setError("You can only upload up to 5 images.");
				return;
			}
			setSelectedFiles((prev) => [...prev, ...filesArray]);

			const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
			setPreviewUrls((prev) => [...prev, ...newPreviews]);
		}
	};

	const removeFile = (index: number) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
		setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
	};

	const { data: categoriesData } = useQuery({
		queryKey: ["categories"],
		queryFn: itemsApi.getCategories,
	});

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ItemFormInput>({
		resolver: zodResolver(itemSchema),
		defaultValues: {
			priority: "medium",
			date: new Date().toISOString().split("T")[0],
			images: [""],
			specifications: [],
		},
	});

	// Image state handled manually

	const {
		fields: specFields,
		append: appendSpec,
		remove: removeSpec,
	} = useFieldArray({
		control: control as any,
		name: "specifications" as never,
	});

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [authLoading, isAuthenticated, router]);

	const onSubmit = async (data: ItemFormInput) => {
		setError("");
		if (selectedFiles.length === 0) {
			setError("At least one image is required");
			toast.error("At least one image is required");
			return;
		}
		setIsSubmitting(true);
		try {
			const formData = new FormData();
			selectedFiles.forEach((file) => formData.append("images", file));

			const uploadRes = await authApi.uploadImages(formData);
			if (!uploadRes.success) throw new Error("Image upload failed");

			const payload: ItemFormData = {
				...data,
				images: uploadRes.urls,
				price: Number(data.price),
				specifications: data.specifications ?? [],
			};
			await itemsApi.createItem(payload);
			// Invalidate all relevant queries so UI updates in real-time
			await queryClient.invalidateQueries({ queryKey: ["items"] });
			await queryClient.invalidateQueries({ queryKey: ["my-items"] });
			setSuccess(true);
			toast.success("Item created successfully!");
			setTimeout(() => router.push("/items/manage"), 1500);
		} catch (err: any) {
			const errorMsg = err.response?.data?.message || "Failed to create item";
			setError(errorMsg);
			toast.error(errorMsg);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (authLoading) {
		return (
			<div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary-600" />
			</div>
		);
	}

	if (!isAuthenticated) return null;

	if (success) {
		return (
			<div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-gray-50">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center">
					<div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
						<PlusCircle className="w-10 h-10 text-green-600" />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Item Created!
					</h2>
					<p className="text-gray-600">Redirecting to your items...</p>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="pt-24 pb-16 min-h-screen bg-gray-50">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}>
					<div className="mb-6">
						<h1 className="text-3xl font-bold text-gray-900">Add New Item</h1>
						<p className="text-gray-600 mt-1">
							List your item for buyers to discover
						</p>
					</div>

					<div className="bg-white rounded-2xl p-6 sm:p-8 card-shadow">
						{error && (
							<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
								{error}
							</div>
						)}

						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-5">
							{/* Title */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Title *
								</label>
								<input
									{...register("title")}
									type="text"
									placeholder="e.g., Vintage Leather Sofa"
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
								/>
								{errors.title && (
									<p className="mt-1 text-sm text-red-600">
										{errors.title.message}
									</p>
								)}
							</div>

							{/* Short Description */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Short Description *
								</label>
								<input
									{...register("shortDescription")}
									type="text"
									placeholder="Brief summary shown in listings"
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
								/>
								{errors.shortDescription && (
									<p className="mt-1 text-sm text-red-600">
										{errors.shortDescription.message}
									</p>
								)}
							</div>

							{/* Full Description */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Full Description *
								</label>
								<textarea
									{...register("description")}
									rows={4}
									placeholder="Detailed description of your item"
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
								/>
								{errors.description && (
									<p className="mt-1 text-sm text-red-600">
										{errors.description.message}
									</p>
								)}
							</div>

							{/* Category & Price Row */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Category *
									</label>
									<select
										{...register("category")}
										className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white">
										<option value="">Select category</option>
										{categoriesData?.categories?.map((cat) => (
											<option
												key={cat}
												value={cat}>
												{cat}
											</option>
										))}
									</select>
									{errors.category && (
										<p className="mt-1 text-sm text-red-600">
											{errors.category.message}
										</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Price (USD) *
									</label>
									<input
										{...register("price")}
										type="number"
										min="0"
										step="0.01"
										placeholder="0.00"
										className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
									/>
									{errors.price && (
										<p className="mt-1 text-sm text-red-600">
											{errors.price.message}
										</p>
									)}
								</div>
							</div>

							{/* Date & Priority Row */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Date *
									</label>
									<input
										{...register("date")}
										type="date"
										className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
									/>
									{errors.date && (
										<p className="mt-1 text-sm text-red-600">
											{errors.date.message}
										</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Priority
									</label>
									<select
										{...register("priority")}
										className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white">
										<option value="low">Low</option>
										<option value="medium">Medium</option>
										<option value="high">High</option>
									</select>
								</div>
							</div>

							{/* Location */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Location *
								</label>
								<input
									{...register("location")}
									type="text"
									placeholder="e.g., San Francisco, CA"
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
								/>
								{errors.location && (
									<p className="mt-1 text-sm text-red-600">
										{errors.location.message}
									</p>
								)}
							</div>

							{/* Images */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Images * (Max 5)
								</label>
								<div className="flex items-center justify-center w-full mb-4">
									<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
										<div className="flex flex-col items-center justify-center pt-5 pb-6">
											<ImagePlus className="w-8 h-8 mb-2 text-gray-500" />
											<p className="text-sm text-gray-500">
												<span className="font-semibold">Click to upload</span>{" "}
												or drag and drop
											</p>
										</div>
										<input
											type="file"
											className="hidden"
											multiple
											accept="image/*"
											onChange={handleFileSelect}
										/>
									</label>
								</div>

								{previewUrls.length > 0 && (
									<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
										{previewUrls.map((url, index) => (
											<div
												key={index}
												className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-square">
												<img
													src={url}
													alt={`Preview ${index}`}
													className="w-full h-full object-cover"
												/>
												<button
													type="button"
													onClick={() => removeFile(index)}
													className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
													<X className="w-4 h-4" />
												</button>
											</div>
										))}
									</div>
								)}
							</div>

							{/* Specifications */}
							<div>
								<div className="flex items-center justify-between mb-2">
									<label className="block text-sm font-medium text-gray-700">
										Specifications
									</label>
									<button
										type="button"
										onClick={() => appendSpec({ key: "", value: "" })}
										className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
										<PlusCircle className="w-4 h-4" />
										Add spec
									</button>
								</div>
								{specFields.map((field, index) => (
									<div
										key={field.id}
										className="flex gap-2 mb-2">
										<input
											{...register(`specifications.${index}.key`)}
											placeholder="Key (e.g., Color)"
											className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
										/>
										<input
											{...register(`specifications.${index}.value`)}
											placeholder="Value (e.g., Red)"
											className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
										/>
										<button
											type="button"
											onClick={() => removeSpec(index)}
											className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
											<X className="w-5 h-5" />
										</button>
									</div>
								))}
							</div>

							{/* Submit */}
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full py-3 bg-linear-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70">
								{isSubmitting ?
									<Loader2 className="w-5 h-5 animate-spin" />
								:	<>
										Create Listing
										<ArrowRight className="w-4 h-4" />
									</>
								}
							</button>
						</form>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
