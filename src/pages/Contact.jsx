import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Leaf } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import SEO from "../components/SEO";

const Contact = () => {
  const { theme } = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [content, setContent] = useState({
    address: "Mandsaur, Madhya Pradesh, India",
    phone: "+91 98931 56792",
    email: "info@sdherbs.com",
    hours: "Mon - Sat: 9:00 AM - 6:00 PM",
    whatsapp: "919893156792",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/page-content/contact`);
        const data = await res.json();
        if (data && data.content) {
          setContent((prev) => ({ ...prev, ...data.content }));
        }
      } catch (err) {
        console.error("Error fetching contact content:", err);
      }
    };
    fetchContent();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setMsg(data.error || "Failed to submit enquiry.");
      }
    } catch (err) {
      console.error("Error submitting enquiry:", err);
      setMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen pt-20 transition-all duration-500 ${theme === "dark"
        ? "bg-gray-900 text-gray-200"
        : "bg-secondary-light text-gray-800"
        }`}
    >
      <SEO
        title="Contact Us"
        description="Get in touch with SD Herbs for bulk orders, inquiries, or support. We are here to assist you with your herbal wellness needs."
      />
      {/* 🌿 Background Aura */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${theme === "dark"
          ? "from-green-950/40 via-gray-900/80 to-gray-900"
          : "from-green-50/70 via-white to-white"
          }`}
      ></div>

      {/* 🌟 Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center py-16 md:py-20"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-primary mb-4"
        >
          Contact <span className="text-green-600">Us</span> 🌱
        </motion.h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "80px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-[3px] mx-auto bg-green-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.7)]"
        ></motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`mt-4 max-w-2xl mx-auto text-base md:text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
        >
          We’re here to answer your questions and help you connect with nature’s
          healing essence 🌿 Let’s grow something wonderful together.
        </motion.p>
      </motion.div>

      {/* 🌿 Contact Section */}
      <div className="max-w-7xl mx-auto relative z-10 px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pb-16">
        {/* 🌿 Left Info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">
            Get in Touch <Leaf className="inline text-green-500" size={28} />
          </h2>
          <p
            className={`text-base ${theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
          >
            Have questions about our herbal products, or want to collaborate?
            Fill out the form or reach us through the contact details below.
          </p>

          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-3">
              <MapPin className="text-green-600" />
              <span>{content.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-green-600" />
              <span>{content.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-green-600" />
              <span>{content.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-green-600" />
              <span>{content.hours}</span>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <a
              href={`https://wa.me/${content.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition"
            >
              WhatsApp Us
            </a>
            <a
              href={`mailto:${content.email}`}
              className="border border-green-600 hover:bg-green-600 hover:text-white px-5 py-2 rounded-lg transition"
            >
              Email Us
            </a>
          </div>
        </motion.div>

        {/* 💌 Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={`relative p-8 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${theme === "dark"
            ? "bg-gray-800/70 border border-gray-700"
            : "bg-white/90 border border-gray-200"
            }`}
        >
          <div
            className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-30 
            ${theme === "dark" ? "bg-green-700/30" : "bg-green-400/20"}`}
          ></div>

          <h3 className="text-2xl font-semibold text-primary mb-2">
            Enquiry Now 💌
          </h3>
          <p className="text-sm text-gray-500 mb-6">Send us a message and we'll get back to you shortly.</p>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 text-green-600 text-center font-medium"
            >
              ✅ Thank you! Your message has been sent.
            </motion.div>
          )}
          {msg && (
            <div className="mb-4 text-red-500 text-center text-sm">
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your Name"
                className={`w-full rounded-lg px-3 py-2 outline-none border text-sm transition ${theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-gray-50 border-gray-300 text-gray-800"
                  } focus:border-green-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className={`w-full rounded-lg px-3 py-2 outline-none border text-sm transition ${theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-gray-50 border-gray-300 text-gray-800"
                  } focus:border-green-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91 XXXXX XXXXX"
                className={`w-full rounded-lg px-3 py-2 outline-none border text-sm transition ${theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-gray-50 border-gray-300 text-gray-800"
                  } focus:border-green-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
                placeholder="Write your message..."
                className={`w-full rounded-lg px-3 py-2 outline-none border text-sm transition resize-none ${theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-gray-50 border-gray-300 text-gray-800"
                  } focus:border-green-500`}
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg shadow-md relative overflow-hidden transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 font-medium">{loading ? "Sending..." : "Send Message"}</span>
              <span
                className="absolute inset-0 bg-gradient-to-r from-green-500 via-green-600 to-green-700 
                  opacity-0 hover:opacity-25 blur-xl transition duration-500"
              ></span>
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* 🗺️ Google Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-16 max-w-7xl mx-auto px-6 pb-16"
      >
        {/* 🌿 Refined Static Heading */}
        <div className="text-center mb-8">
          <h3
            className={`text-3xl font-bold flex items-center justify-center gap-2 transition-colors duration-500 ${theme === "dark"
              ? "text-primary drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]"
              : "text-green-700 drop-shadow-[0_0_3px_rgba(0,0,0,0.2)]"
              }`}
          >
            Find Us on Google Maps{" "}
            <span className="inline-block text-green-600">📍</span>
          </h3>

          {/* 🌱 Animated Underline (premium shimmer) */}
          <div className="relative mx-auto mt-3 w-28 h-[3px] rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-600 to-green-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
              className="absolute inset-0 w-1/3 bg-white/70 blur-sm opacity-70"
            ></motion.div>
          </div>

          {/* ✨ Reflection Line */}
          <div
            className={`mx-auto mt-1 w-24 h-[1px] rounded-full opacity-40 ${theme === "dark" ? "bg-white/30" : "bg-green-900/20"
              }`}
          ></div>
        </div>

        {/* 🌿 Map Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl group transition-all duration-500">
          <div
            className={`absolute inset-0 z-0 opacity-40 blur-3xl rounded-2xl transition-all duration-700 ${theme === "dark" ? "bg-green-800/40" : "bg-green-300/30"
              }`}
          ></div>

          <div
            className={`relative z-10 overflow-hidden rounded-2xl border transition-all duration-300 ${theme === "dark" ? "border-gray-700" : "border-gray-200"
              } group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]`}
          >
            <iframe
              title="SD Herbs Location"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d29133.184723659324!2d75.095835!3d24.113868!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39642dad9dfa7483%3A0x184ff57e445b6806!2sShree%20divyanand%20Herbals!5e0!3m2!1sen!2sus!4v1764174989006!5m2!1sen!2sus"
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="rounded-2xl transform transition-transform duration-700 group-hover:scale-[1.01]"
            ></iframe>
          </div>

          <div
            className="absolute inset-0 rounded-2xl pointer-events-none 
                bg-gradient-to-t from-transparent via-transparent to-white/10 dark:to-white/5"
          ></div>
        </div>
      </motion.div>

    </div>
  );
};

export default Contact;
