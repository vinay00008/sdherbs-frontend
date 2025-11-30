import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, Eye } from "lucide-react";
import { IMAGE_BASE_URL } from "../config";

const ProductCard = ({ product }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg overflow-hidden group border border-gray-100 dark:border-gray-700"
    >
      <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={
            product.images?.[0]
              ? (product.images[0].startsWith('http')
                ? product.images[0]
                : `${IMAGE_BASE_URL}${product.images[0].startsWith('/') ? '' : '/'}${product.images[0].replace(/\\/g, '/')}`)
              : "https://via.placeholder.com/400x400?text=No+Image"
          }
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            to={`/products/${product._id}`}
            className="bg-white text-gray-900 px-6 py-3 rounded-full shadow-lg hover:bg-green-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 font-bold flex items-center gap-2"
            title="View Details"
          >
            <Eye size={20} /> View Details
          </Link>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 h-10">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            {product.category?.name || "Herbal"}
          </span>
          <Link to={`/products/${product._id}`} className="text-sm font-semibold text-green-600 hover:underline">
            Enquiry Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
