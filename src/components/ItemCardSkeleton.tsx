'use client';

export function ItemCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden card-shadow animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded-lg w-full mb-1" />
        <div className="h-4 bg-gray-200 rounded-lg w-2/3 mb-3" />
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded-lg w-20" />
          <div className="h-4 bg-gray-200 rounded-lg w-16" />
        </div>
      </div>
    </div>
  );
}
