import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import SEO from "../components/SEO";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // SIMPLIFIED FETCH LOGIC
  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log("Fetching products from:", axiosInstance.defaults.baseURL + "/products");
        const res = await axiosInstance.get("/products");
        console.log("Products fetched:", res.data);
        setProducts(res.data);
      } catch (err) {
        console.error("API error:", err);
        // DO NOT set UI error state here to avoid "Network Error" banner
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <SEO title="Our Products (Debug Mode)" />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">
          Our Products (Debug Mode)
        </h1>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          /* Product Grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">No products found.</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;
