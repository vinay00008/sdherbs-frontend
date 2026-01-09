import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Leaf, ShieldCheck, Truck, Star, Users, Globe, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { IMAGE_BASE_URL } from "../config";

import SEO from "../components/SEO";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [heroContent, setHeroContent] = useState({
    title: "Unlock Nature's Healing Power",
    subtitle: "Experience the purest form of Ayurveda. Scientifically tested, ethically sourced, and delivered with care.",
    heroImage: "https://www.tasteofhome.com/wp-content/uploads/2023/10/GettyImages-1154618104-spices-and-herbs-FT-JVedit.jpg"
  });
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, activitiesRes, contentRes] = await Promise.all([
          axiosInstance.get("/products"),
          axiosInstance.get("/activities"),
          axiosInstance.get("/page-content/home")
        ]);
        setFeaturedProducts(productsRes.data.slice(0, 3));
        setLatestNews(activitiesRes.data.slice(0, 3)); // Use activities (blogs) as news

        if (contentRes.data) {
          setHeroContent({
            title: contentRes.data.title || "Unlock Nature's Healing Power",
            subtitle: contentRes.data.description || "Experience the purest form of Ayurveda. Scientifically tested, ethically sourced, and delivered with care.",
            heroImage: contentRes.data.content?.heroImage || "https://www.tasteofhome.com/wp-content/uploads/2023/10/GettyImages-1154618104-spices-and-herbs-FT-JVedit.jpg"
          });
        }
      } catch (err) {
        console.error("Error fetching home data:", err);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="overflow-hidden bg-white dark:bg-[#0b1220]">
      <SEO
        title="Home"
        description="Discover premium herbal products rooted in Ayurveda. SD Herbs offers 100% organic, certified, and ethically sourced natural remedies."
      />
      {/* 🌿 HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-100/40 dark:bg-green-900/10 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 mb-8 w-fit"
            >
              <Leaf size={16} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-800 dark:text-green-300 tracking-wide uppercase">
                Premium Herbal Extracts
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
              {heroContent.title.split(/<br\s*\/?>/i).map((part, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <br />}
                  {index === 1 ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                      {part}
                    </span>
                  ) : (
                    part
                  )}
                </React.Fragment>
              ))}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-lg leading-relaxed">
              {heroContent.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="group bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-green-500/30 hover:-translate-y-1"
              >
                Explore Products
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 rounded-full font-bold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-green-600 dark:hover:border-green-500 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-all flex items-center justify-center"
              >
                Contact Us
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center gap-8 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-[#0b1220]" />
                  ))}
                </div>
                <span className="text-sm font-medium">500+ Happy Clients</span>
              </div>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">4.9/5</span>
                <span className="text-sm">Rating</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative h-[400px] lg:h-full mt-10 lg:mt-0"
          >
            <div className="relative z-10 w-full h-full">
              <img
                src={heroContent.heroImage}
                alt="Herbal Products"
                className="rounded-[2.5rem] shadow-2xl w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
              />

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 max-w-xs"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">100% Certified</h4>
                    <p className="text-xs text-gray-500">ISO & GMP Approved</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  We ensure every product meets the highest global standards of purity.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🌟 WHY CHOOSE US */}
      <section className="py-24 bg-gray-50 dark:bg-[#0f172a] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-green-600 font-bold tracking-wider uppercase text-sm">Why Choose SD Herbs</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6 text-gray-900 dark:text-white">Quality You Can Trust</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              We go beyond industry standards to deliver herbal products that are pure, potent, and effective.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: <Leaf size={32} />, title: "100% Organic", desc: "Sourced directly from certified organic farms, ensuring zero chemical residue." },
              { icon: <ShieldCheck size={32} />, title: "Lab Tested", desc: "Every batch undergoes rigorous testing for purity, potency, and safety." },
              { icon: <Truck size={32} />, title: "Global Shipping", desc: "Fast and secure delivery network covering over 20 countries worldwide." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🛍️ FEATURED PRODUCTS */}
      <section className="py-24 bg-white dark:bg-[#0b1220]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-green-600 font-bold tracking-wider uppercase text-sm">Our Collection</span>
              <h2 className="text-4xl font-bold mt-3 text-gray-900 dark:text-white">Featured Products</h2>
            </div>
            <Link to="/products" className="group flex items-center gap-2 text-gray-900 dark:text-white font-bold hover:text-green-600 transition-colors">
              View All Products
              <span className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full group-hover:bg-green-600 group-hover:text-white transition-all">
                <ArrowRight size={20} />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-gray-100 dark:bg-[#1e293b] mb-6 relative">
                    <img
                      src={
                        product.images?.[0]
                          ? product.images[0].startsWith("http")
                            ? product.images[0]
                            : `${IMAGE_BASE_URL}${product.images[0]}`
                          : "https://via.placeholder.com/400"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Floating Action Button */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 w-[80%]">
                      <Link
                        to={`/products/${product._id}`}
                        state={{ from: "/" }}
                        className="block w-full bg-white/90 backdrop-blur-sm text-gray-900 text-center py-3 rounded-xl font-bold hover:bg-green-600 hover:text-white transition-colors shadow-lg"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors">
                    <Link to={`/products/${product._id}`} state={{ from: "/" }}>
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{product.description}</p>
                  <Link
                    to={`/products/${product._id}`}
                    state={{ from: "/" }}
                    className="inline-flex items-center gap-1 text-green-600 font-semibold hover:gap-2 transition-all"
                  >
                    Learn More <ChevronRight size={16} />
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 py-20 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading premium selection...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 📰 LATEST NEWS (BLOGS) */}
      <section className="py-24 bg-gray-50 dark:bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Latest Insights</h2>
            <p className="text-gray-600 dark:text-gray-400">Stay updated with the latest trends in Ayurveda and herbal wellness.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.length > 0 ? (
              latestNews.map((news) => (
                <motion.div
                  key={news._id}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all flex flex-col h-full"
                >
                  {news.photos && news.photos.length > 0 && (
                    <div className="h-48 rounded-xl overflow-hidden mb-4">
                      <img
                        src={news.photos[0].url}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  )}
                  <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold mb-4 w-fit">
                    {new Date(news.createdAt).toLocaleDateString()}
                  </span>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">{news.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 flex-1">{news.description}</p>
                  <Link to="/activity" className="text-green-600 font-bold hover:underline mt-auto">
                    Read Full Article
                  </Link>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 col-span-3 text-center">No news updates yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* 📞 CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900 dark:bg-black">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to Experience Pure Quality?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Get in touch with us for bulk orders, custom formulations, or any inquiries. We are here to serve you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-green-500/50 hover:-translate-y-1"
            >
              Get a Quote
            </Link>
            <Link
              to="/products"
              className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-10 py-4 rounded-full font-bold text-lg transition-all"
            >
              View Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
