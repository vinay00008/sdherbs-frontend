import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Award, Users, Heart, Globe, ShieldCheck, Loader2 } from "lucide-react";
import axios from "../api/axiosConfig";
import SEO from "../components/SEO";

const iconMap = {
    Leaf: <Leaf size={40} />,
    Award: <Award size={40} />,
    Heart: <Heart size={40} />,
    Users: <Users size={40} />,
    Globe: <Globe size={40} />,
    ShieldCheck: <ShieldCheck size={40} />,
};

const About = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await axios.get("/page-content/about");
                if (res.data && res.data.content) {
                    setContent(res.data.content);
                }
            } catch (err) {
                console.error("Error fetching about content:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const getImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        return `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${path}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0b1220]">
                <Loader2 className="animate-spin text-green-600" size={40} />
            </div>
        );
    }

    // Fallback defaults if content is missing (e.g. first load)
    const hero = content?.hero || { title: "Rooted in Nature", subtitle: "Driven by Purity" };
    const story = content?.story || { title: "Our Story", content: "At SD Herbs, we believe in the healing power of nature..." };
    const mission = content?.mission || { title: "Mission", content: "To bring authentic herbal products to the world." };
    const vision = content?.vision || { title: "Vision", content: "To be a global leader in sustainable wellness." };
    const values = content?.values || [];
    const team = content?.team || [];
    const stats = content?.stats || [];

    return (
        <div className="min-h-screen bg-white dark:bg-[#0b1220] overflow-hidden">
            <SEO
                title="About Us"
                description="Learn about SD Herbs' journey, our commitment to organic farming, and our mission to bring authentic Ayurvedic healing to the world."
            />
            {/* 🌿 HERO SECTION */}
            <section className="relative py-32 flex items-center justify-center overflow-hidden">
                {/* Background Image if available */}
                {hero.image && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={getImageUrl(hero.image)}
                            alt="About Hero"
                            className="w-full h-full object-cover opacity-30 dark:opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/60 to-white dark:from-[#0b1220]/90 dark:via-[#0b1220]/70 dark:to-[#0b1220]" />
                    </div>
                )}

                {/* Decorative Blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative z-10">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block py-1 px-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-semibold mb-6"
                    >
                        About Us
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                    >
                        {hero.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto"
                    >
                        {hero.subtitle}
                    </motion.p>
                </div>
            </section>

            {/* 📖 STORY SECTION */}
            <section className="py-20 w-full max-w-7xl mx-auto px-4 md:px-6 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            {story.title}
                        </h2>
                        <div className="prose dark:prose-invert max-w-none w-full text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line break-words">
                            {story.content}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        {/* Enhanced Image Design */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-500"></div>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
                            <img
                                src={story.image ? getImageUrl(story.image) : "https://via.placeholder.com/600x400"}
                                alt="Our Story"
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600">
                                <Leaf size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Est. 2020</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Pure & Natural</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 🎯 MISSION & VISION */}
            <section className="py-20 bg-gray-50 dark:bg-[#0f172a]">
                <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-[#1e293b] p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
                    >
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                            <Globe size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{mission.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{mission.content}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-[#1e293b] p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
                    >
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{vision.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{vision.content}</p>
                    </motion.div>
                </div>
            </section>

            {/* 🌟 CORE VALUES */}
            {values.length > 0 && (
                <section className="py-20 max-w-7xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
                        <p className="text-gray-600 dark:text-gray-400">The principles that guide everything we do.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-8 rounded-2xl bg-gray-50 dark:bg-[#1e293b] hover:shadow-lg transition-all border border-transparent hover:border-green-100 dark:hover:border-green-900"
                            >
                                <div className="inline-flex p-4 rounded-full bg-white dark:bg-gray-800 text-green-600 shadow-sm mb-6">
                                    {iconMap[item.icon] || <Leaf size={40} />}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* 📊 STATS */}
            {stats.length > 0 && (
                <section className="py-20 bg-green-600 dark:bg-green-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
                        {stats.map((stat, i) => (
                            <div key={i}>
                                <h3 className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</h3>
                                <p className="text-green-100 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 👥 TEAM SECTION */}
            {team.length > 0 && (
                <section className="py-20 bg-gray-50 dark:bg-[#0f172a]">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">Meet the Minds Behind SD Herbs</h2>
                        <div className="flex justify-center flex-wrap gap-8">
                            {team.map((member, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 max-w-xs w-full"
                                >
                                    <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full mb-6 overflow-hidden border-4 border-green-50 dark:border-green-900/30">
                                        <img
                                            src={getImageUrl(member.image)}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                                    <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-3">{member.role}</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{member.bio}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default About;
