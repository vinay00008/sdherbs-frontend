import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import SEO from "../components/SEO";

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");
  const urlSearchTerm = searchParams.get("search"); // 🔍 Get search term from URL

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm || ""); // Initialize with URL param
  const [loading, setLoading] = useState(true);

  // Update searchTerm if URL changes
  useEffect(() => {
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [urlSearchTerm]);

  // 🧠 Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        // Filter out categories with no products
        const validCategories = res.data.filter(cat => cat.productCount > 0);
        setCategories(validCategories);

        // Set first valid category as active if none selected in URL
        if (validCategories.length > 0 && !activeCategory) {
          setSearchParams({ category: validCategories[0]._id }, { replace: true });
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCategories();
  }, []); // Run once on mount

  // 🧠 Fetch Products (filtered)
  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        let url = "/products";
        if (activeCategory) {
          url += `?category=${activeCategory}`;
        }
        const res = await axiosInstance.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  // 📱 UX: Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory]);

  // 🔍 Search filter
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryChange = (id) => {
    setSearchParams({ category: id });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-secondary.light dark:bg-secondary.dark transition-all duration-500">
      <SEO
        title="Our Products"
        description="Explore our wide range of premium herbal powders, extracts, and natural remedies. 100% organic and lab-tested."
      />
      {/* Sidebar (Visible on Desktop Only) */}
      <aside className="hidden lg:block w-64 bg-white dark:bg-gray-900 shadow-soft rounded-r-xl p-5 sticky top-20 h-fit self-start">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Product Categories
        </h2>
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li key={cat._id}>
              <button
                onClick={() => handleCategoryChange(cat._id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all ${activeCategory === cat._id
                  ? "bg-primary text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-800"
                  }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Section */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-primary dark:text-green-300">
            {categories.find(c => c._id === activeCategory)?.name || "Our Products"}
          </h1>

          {/* Mobile Category Dropdown */}
          <div className="w-full sm:hidden">
            <select
              value={activeCategory || ""}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search products..."
            className="w-full sm:w-64 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        {/* Loading / Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No products found for this category.
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Products;
