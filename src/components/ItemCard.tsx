'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Item } from '@/types';
import { formatPrice, truncate } from '@/lib/utils';
import { Star, MapPin, Calendar } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  viewMode?: 'grid' | 'list';
}

export function ItemCard({ item, viewMode = 'grid' }: ItemCardProps) {
  const imageUrl = item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop';

  if (viewMode === 'list') {
    return (
      <Link href={`/items/${item._id}`} className="group flex gap-4 bg-white rounded-2xl overflow-hidden card-shadow hover-lift">
        <div className="relative w-48 h-40 flex-shrink-0">
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
          <span className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700">
            {item.category}
          </span>
        </div>
        <div className="flex-1 py-4 pr-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{truncate(item.shortDescription, 120)}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {item.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              {item.rating || 'N/A'}
            </span>
          </div>
          <p className="text-lg font-bold text-primary-600 mt-2">{formatPrice(item.price)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/items/${item._id}`} className="group block bg-white rounded-2xl overflow-hidden card-shadow hover-lift">
      <div className="relative aspect-[4/3]">
        <Image
          src={imageUrl}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700">
          {item.category}
        </span>
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-medium ${
          item.priority === 'high'
            ? 'bg-red-100 text-red-700'
            : item.priority === 'medium'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {item.priority}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-1 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.shortDescription}</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-primary-600">{formatPrice(item.price)}</p>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[100px]">{item.location}</span>
          </div>
        </div>
        {item.rating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.round(item.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({item.reviewCount || 0})</span>
          </div>
        )}
      </div>
    </Link>
  );
}
