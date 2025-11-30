import React from "react";
import { Loader2 } from "lucide-react";

const LoadingFallback = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0b1220]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-green-600" size={48} />
                <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
                    Loading SD Herbs...
                </p>
            </div>
        </div>
    );
};

export default LoadingFallback;
