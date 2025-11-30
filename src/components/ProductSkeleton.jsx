import React from "react";
import { motion } from "framer-motion";

const ProductSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col">
            {/* Image Skeleton */}
            <div className="relative h-48 sm:h-56 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

            {/* Content Skeleton */}
            <div className="p-4 flex flex-col flex-grow space-y-3">
                {/* Category Badge */}
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>

                {/* Title */}
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

                {/* Description */}
                <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>

                {/* Price & Button */}
                <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
