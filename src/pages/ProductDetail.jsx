import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "../api/axiosConfig";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Check, Truck, ShieldCheck } from "lucide-react";
import EnquiryModal from "../components/EnquiryModal";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";

const ProductDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

    // Determine back link source
    const backLink = location.state?.from === "/" ? "/" : (product?.category?._id ? `/products?category=${product.category._id}` : "/products");
    const backText = location.state?.from === "/" ? "Back to Home" : "Back to Products";

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const allRes = await axios.get("/products");
                const found = allRes.data.find((p) => p._id === id);
                setProduct(found);

                // Fetch related products
                if (found && found.category) {
                    const related = allRes.data
                        .filter(p => p.category._id === found.category._id && p._id !== found._id)
                        .slice(0, 4); // Limit to 4 related products
                    setRelatedProducts(related);
                }
            } catch (err) {
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-[#0b1220] pt-24 pb-12 px-6">
            {product && (
                <SEO
                    title={product.name}
                    description={product.description}
                    image={product.images?.[0] ? (product.images[0].startsWith('http') ? product.images[0] : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${product.images[0]}`) : ""}
                />
            )}
            <div className="max-w-6xl mx-auto">
                <Link
                    to={backLink}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> {backText}
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-100 dark:bg-[#1e293b] rounded-3xl overflow-hidden shadow-lg"
                    >
                        <img
                            src={product.images?.[0] ? (product.images[0].startsWith('http') ? product.images[0] : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${product.images[0]}`) : "https://via.placeholder.com/600"}
                            alt={product.name}
                            className="w-full h-full object-cover min-h-[400px]"
                        />
                    </motion.div>

                    {/* Info Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col justify-center"
                    >
                        <span className="text-green-600 font-semibold tracking-wider uppercase mb-2">
                            {product.category?.name || "Herbal Product"}
                        </span>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="flex items-center gap-6 mb-8">
                            {/* Price hidden or shown based on requirement, keeping it for now but less prominent if needed */}
                            {product.price > 0 && (
                                <span className="text-4xl font-bold text-gray-900 dark:text-white">₹{product.price}</span>
                            )}

                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                                <Check size={16} /> Bulk Available
                            </span>
                        </div>

                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={() => setIsEnquiryOpen(true)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-green-500/30"
                            >
                                <ShoppingBag size={22} /> Enquiry Now
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-[#1e293b]">
                                <Truck className="text-green-600" size={24} />
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Pan India Delivery</h4>
                                    <p className="text-xs text-gray-500">Secure shipping</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-[#1e293b]">
                                <ShieldCheck className="text-green-600" size={24} />
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Quality Certified</h4>
                                    <p className="text-xs text-gray-500">100% Organic</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((related) => (
                                <ProductCard key={related._id} product={related} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Enquiry Modal */}
            <EnquiryModal
                isOpen={isEnquiryOpen}
                onClose={() => setIsEnquiryOpen(false)}
                product={product}
            />
        </div>
    );
};

export default ProductDetail;
