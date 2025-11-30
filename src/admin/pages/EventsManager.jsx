import React, { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Plus, Pencil, Trash2, X } from "lucide-react";

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", location: "", date: "", description: "" });
  const [editingId, setEditingId] = useState(null); // Track which event is being edited

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing event
        await axios.put(`/events/${editingId}`, formData);
      } else {
        // Create new event
        await axios.post("/events", formData);
      }
      fetchEvents();
      closeModal();
    } catch (err) {
      console.error("Error saving event:", err);
      alert("Failed to save event");
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      location: event.location || "",
      date: event.date ? event.date.split('T')[0] : "",
      description: event.description || ""
    });
    setEditingId(event._id);
    setIsModalOpen(true);
  };

  // ---------- DELETE EVENT ----------
  const [deleteId, setDeleteId] = useState(null);

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`/events/${deleteId}`);
      setEvents(events.filter((e) => e._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ title: "", location: "", date: "", description: "" });
    setEditingId(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 self-start sm:self-auto shadow-md transition-all"
        >
          <Plus size={18} /> Add Event
        </button>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-xl shadow-2xl overflow-hidden p-6 text-center"
          >
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Delete Event?</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading events...</p>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden sm:block bg-white dark:bg-[#1e293b] rounded-xl shadow overflow-hidden w-full border border-gray-200 dark:border-gray-700">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-[#0f172a]">
                <tr>
                  <th className="p-4 text-sm font-semibold text-left text-gray-600 dark:text-gray-300">Title</th>
                  <th className="p-4 text-sm font-semibold text-left text-gray-600 dark:text-gray-300">Location</th>
                  <th className="p-4 text-sm font-semibold text-left text-gray-600 dark:text-gray-300">Date</th>
                  <th className="p-4 text-sm font-semibold text-right text-gray-600 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((eventItem) => (
                  <tr key={eventItem._id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4 text-gray-800 dark:text-gray-200 font-medium">{eventItem.title}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-green-500" /> {eventItem.location}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                        {new Date(eventItem.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(eventItem);
                          }}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                          title="Edit Event"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(eventItem._id);
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                          title="Delete Event"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <Calendar size={48} className="text-gray-300 dark:text-gray-600" />
                        <p className="text-lg font-medium">No events found</p>
                        <p className="text-sm">Create your first event to get started.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="sm:hidden space-y-4">
            {events.map((eventItem) => (
              <div key={eventItem._id} className="bg-white dark:bg-[#1e293b] shadow-md rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <h2 className="font-bold text-lg text-gray-800 dark:text-white mb-2">{eventItem.title}</h2>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <MapPin size={16} /> {eventItem.location}
                </div>
                <div className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  📅 {new Date(eventItem.date).toLocaleDateString()}
                </div>
                <div className="flex justify-end gap-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(eventItem);
                    }}
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(eventItem._id);
                    }}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-center text-gray-500 py-4">No events found.</p>
            )}
          </div>
        </>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold dark:text-white">
                  {editingId ? "Edit Event" : "Add Event"}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-red-500">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all mt-2"
                >
                  {editingId ? "Update Event" : "Create Event"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventsManager;
