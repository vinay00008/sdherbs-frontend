import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { motion } from "framer-motion";
import { Calendar, MapPin, Image as ImageIcon } from "lucide-react";

const ActivityPage = () => {
  const [events, setEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [galleryGroups, setGalleryGroups] = useState({});
  const [pageContent, setPageContent] = useState({ title: "Our Activities", description: "Explore our latest events, workshops, and community gatherings." });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, galleryRes, contentRes, blogsRes] = await Promise.all([
          axios.get("/events"),
          axios.get("/gallery"),
          axios.get("/page-content/activity"),
          axios.get("/activities")
        ]);

        setEvents(eventsRes.data);
        setBlogs(blogsRes.data || []);

        // Group gallery images by category
        const groups = galleryRes.data.reduce((acc, item) => {
          const category = item.category || "General";
          if (!acc[category]) acc[category] = [];
          acc[category].push(item);
          return acc;
        }, {});
        setGalleryGroups(groups);

        if (contentRes.data && contentRes.data.title) {
          setPageContent(contentRes.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Split events into Upcoming and Past
  const now = new Date();
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastEvents = events
    .filter(e => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading activities...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1220] py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-green-700 dark:text-green-400">
            {pageContent.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {pageContent.description}
          </p>
        </div>

        {/* 📰 BLOGS / NEWS FEED */}
        {blogs.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3 border-b pb-4 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <ImageIcon size={18} />
              </div>
              Latest News & Updates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          </section>
        )}

        {/* 📅 UPCOMING EVENTS */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3 border-b pb-4 border-gray-200 dark:border-gray-700">
            <Calendar className="text-green-600" /> Upcoming Events
          </h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500">No upcoming events scheduled at the moment.</p>
            </div>
          )}
        </section>

        {/* 🕰️ PAST EVENTS */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3 border-b pb-4 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <Calendar size={18} />
              </div>
              Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-90">
              {pastEvents.map((event) => (
                <EventCard key={event._id} event={event} isPast />
              ))}
            </div>
          </section>
        )}

        {/* 🖼️ DYNAMIC GALLERY SECTIONS */}
        {Object.keys(galleryGroups).length > 0 ? (
          Object.entries(galleryGroups).map(([category, images]) => (
            <section key={category}>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-10 flex items-center gap-3 border-b pb-4 border-gray-200 dark:border-gray-700">
                <ImageIcon className="text-green-600" /> {category} Gallery
              </h2>
              <GallerySection images={images} />
            </section>
          ))
        ) : (
          <div className="text-center py-10 bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500">No photo galleries available.</p>
          </div>
        )}

      </div>
    </div>
  );
};

// Sub-component for Blog Card
const BlogCard = ({ blog }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row h-full"
  >
    {blog.photos && blog.photos.length > 0 && (
      <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden group">
        <img
          src={blog.photos[0].url}
          alt={blog.title}
          className={`w-full h-full object-${blog.fitMode || 'cover'} transition-transform duration-500 group-hover:scale-110`}
        />
        {blog.photos.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            +{blog.photos.length - 1} more
          </div>
        )}
      </div>
    )}
    <div className="p-6 flex-1 flex flex-col justify-center">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{blog.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 line-clamp-4 leading-relaxed">
        {blog.description}
      </p>
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400">
        Posted on {new Date().toLocaleDateString()}
      </div>
    </div>
  </motion.div>
);

// Sub-component for Event Card
const EventCard = ({ event, isPast }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all ${isPast ? 'grayscale-[0.3]' : ''}`}
  >
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`px-3 py-1 rounded-lg text-sm font-bold ${isPast ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
          {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
        {isPast && <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded">Completed</span>}
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>

      {event.location && (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3 text-sm">
          <MapPin size={16} /> {event.location}
        </div>
      )}

      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
        {event.description}
      </p>
    </div>
  </motion.div>
);

// Sub-component for Gallery Section (Horizontal Scroll)
const GallerySection = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-end text-sm text-gray-500 dark:text-gray-500 font-medium">
        {images.length} Photos
      </div>

      {/* Scrollable Container */}
      <div className="relative group">
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
          {images.map((img, index) => (
            <div
              key={img._id || index}
              className="snap-center shrink-0 w-72 h-56 sm:w-80 sm:h-64 rounded-xl overflow-hidden shadow-md bg-gray-100 dark:bg-gray-800 relative"
            >
              <img
                src={img.image && img.image.startsWith('http') ? img.image : `http://localhost:5000${img.image}`}
                alt={img.caption || "Gallery Image"}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                loading="lazy"
              />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm truncate">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Gradient Fade for scroll hint */}
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white/80 dark:from-[#0b1220]/80 to-transparent pointer-events-none md:hidden" />
      </div>
    </div>
  );
};

export default ActivityPage;
