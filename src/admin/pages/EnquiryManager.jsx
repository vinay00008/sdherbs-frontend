import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Trash2, Copy, X, CheckCircle } from "lucide-react";
import ConfirmationModal from "../../components/ConfirmationModal";

const EnquiryManager = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
    });

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const res = await axiosInstance.get("/enquiries");
            setEnquiries(res.data);
        } catch (err) {
            console.error("Error fetching enquiries:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Enquiry?",
            message: "Are you sure you want to delete this enquiry? This action cannot be undone.",
            onConfirm: async () => {
                try {
                    await axiosInstance.delete(`/enquiries/${id}`);
                    setEnquiries(enquiries.filter((e) => e._id !== id));
                } catch (err) {
                    console.error("Error deleting enquiry:", err);
                    alert("Failed to delete enquiry");
                }
            }
        });
    };

    const openModal = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setIsModalOpen(true);
        setCopied(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEnquiry(null);
    };

    const handleCopy = () => {
        if (!selectedEnquiry) return;

        const details = `
Name: ${selectedEnquiry.name}
Email: ${selectedEnquiry.email}
Phone: ${selectedEnquiry.phone}
Product: ${selectedEnquiry.product?.name || "General Enquiry"}
Date: ${new Date(selectedEnquiry.createdAt).toLocaleString()}
Message:
${selectedEnquiry.message}
        `.trim();

        navigator.clipboard.writeText(details).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Enquiry Manager</h1>

            {loading ? (
                <p className="text-gray-500">Loading enquiries...</p>
            ) : enquiries.length === 0 ? (
                <div className="text-center py-10 bg-white dark:bg-[#1e293b] rounded-xl shadow">
                    <p className="text-gray-500 dark:text-gray-400">No enquiries found.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Product</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {enquiries.map((enquiry) => (
                                    <tr key={enquiry._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(enquiry.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {enquiry.name}
                                            <div className="text-xs text-gray-500 font-normal">{enquiry.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {enquiry.product?.name || <span className="text-gray-400 italic">General</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${enquiry.status === 'Resolved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {enquiry.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <button
                                                onClick={() => openModal(enquiry)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(enquiry._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* DETAILS MODAL */}
            <AnimatePresence>
                {isModalOpen && selectedEnquiry && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-[#1e293b] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-2xl font-bold dark:text-white">Enquiry Details</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${copied
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                                            }`}
                                    >
                                        {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                    <button onClick={closeModal} className="text-gray-500 hover:text-red-500 p-1">
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Name</label>
                                        <p className="text-gray-900 dark:text-white font-medium">{selectedEnquiry.name}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Date</label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {new Date(selectedEnquiry.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Email</label>
                                        <p className="text-gray-900 dark:text-white font-medium">{selectedEnquiry.email}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Phone</label>
                                        <p className="text-gray-900 dark:text-white font-medium">{selectedEnquiry.phone}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Interested Product</label>
                                    <p className="text-green-600 font-medium">
                                        {selectedEnquiry.product?.name || "General Enquiry"}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Message</label>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mt-1">
                                        {selectedEnquiry.message}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CONFIRMATION MODAL */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </div>
    );
};

export default EnquiryManager;

