import React from "react";
import { Leaf, Users, Globe, Star } from "lucide-react";

const StatsBar = () => {
    return (
        <div className="bg-green-600 text-white py-3 px-4 block">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm font-medium gap-3 md:gap-0">
                <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-2">
                        <Leaf size={14} className="text-green-200" />
                        <span>50+ Products</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users size={14} className="text-green-200" />
                        <span>500+ Happy Clients</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe size={14} className="text-green-200" />
                        <span>20+ Countries</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Star size={14} className="text-yellow-300 fill-yellow-300" />
                    <span>15+ Years of Excellence</span>
                </div>
            </div>
        </div>
    );
};

export default StatsBar;
