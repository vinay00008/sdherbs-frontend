import React, { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon, Search, FolderPlus, Settings, Loader2, CheckCircle, Upload, AlertCircle } from "lucide-react";
import ConfirmationModal from "../../components/ConfirmationModal";

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // UX State
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false); // New state for upload modal
    const [toast, setToast] = useState({ show: false, message: "", type: "success" }); // New state for toast

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
    });

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "0",
        stock: "100",
        category: "",
        image: null,
    });

    const [newCategoryName, setNewCategoryName] = useState("");

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // Toast Helper
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products:", err);
            showToast("Failed to load products", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/categories");
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
            setCategories([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 10 * 1024 * 1024) {
            showToast("File size exceeds 10MB limit.", "error");
            e.target.value = ""; // Clear input
            return;
        }
        setFormData((prev) => ({ ...prev, image: file }));
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            const res = await axios.post("/categories", { name: newCategoryName });
            setCategories([...categories, res.data]);
            setFormData(prev => ({ ...prev, category: res.data._id }));
            setNewCategoryName("");
            setIsCategoryModalOpen(false);
            showToast("Category created successfully!", "success");
        } catch (err) {
            showToast("Failed to create category", "error");
        }
    };

    const handleDeleteCategory = (id) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Category?",
            message: "WARNING: This will delete the category AND ALL PRODUCTS inside it. This action cannot be undone.",
            onConfirm: async () => {
                try {
                    await axios.delete(`/categories/${id}`);
                    setCategories(categories.filter(c => c._id !== id));
                    fetchProducts(); // Refresh products as some might be deleted
                    showToast("Category deleted successfully!", "success");
                } catch (err) {
                    showToast("Failed to delete category", "error");
                }
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category) {
            showToast("Please select a category.", "error");
            return;
        }

        setIsSaving(true); // Start loading

        // If there's an image, we treat it as an "uploading" process for UX if desired, 
        // but typically the whole save is the process. 
        // However, if we want to show the specific "Uploading..." modal, we can setUploading(true)
        // if there is a file. But since this is a form submit, 'isSaving' usually covers it.
        // To be consistent with "image upload" feedback, if there is an image, we can show the upload modal.
        if (formData.image) {
            setUploading(true);
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("stock", formData.stock);
        data.append("category", formData.category);
        if (formData.image) data.append("image", formData.image);

        try {
            if (editingProduct) {
                await axios.put(`/products/${editingProduct._id}`, data);
                showToast("Product updated successfully!", "success");
            } else {
                await axios.post("/products", data);
                showToast("Product added successfully!", "success");
            }
            fetchProducts();
            closeModal();
        } catch (err) {
            console.error("Error saving product:", err);
            showToast("Failed to save product: " + (err.response?.data?.error || err.message), "error");
        } finally {
            setIsSaving(false); // Stop loading
            setUploading(false); // Stop uploading modal
        }
    };

    const handleDelete = (id) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Product?",
            message: "Are you sure you want to delete this product? The image will also be deleted.",
            onConfirm: async () => {
                try {
                    await axios.delete(`/products/${id}`);
                    setProducts(products.filter((p) => p._id !== id));
                    showToast("Product deleted successfully!", "success");
                } catch (err) {
                    console.error("Error deleting product:", err);
                    showToast("Failed to delete product", "error");
                }
            }
        });
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price || "0",
                stock: product.stock || "100",
                category: product.category?._id || product.category,
                image: null,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: "",
                description: "",
                price: "0",
                stock: "100",
                category: categories.length > 0 ? categories[0]._id : "",
                image: null
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="p-6 relative">
            {/* TOAST NOTIFICATION */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl border ${toast.type === "success"
                            ? "bg-white text-green-700 border-green-200"
                            : "bg-white text-red-700 border-red-200"
                            }`}
                    >
                        {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span className="font-medium">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* UPLOAD MODAL */}
            <AnimatePresence>
                {uploading && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Upload size={20} className="text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Uploading...</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we process your request.</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Product Manager</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsManageCategoriesOpen(true)}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        <Settings size={20} /> Manage Categories
                    </button>
                    <button
                        onClick={() => openModal()}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                    >
                        <Plus size={20} /> Add Product
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-green-600" size={48} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                            <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[0].startsWith('http') ? product.images[0] : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:10000'}${product.images[0]}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <ImageIcon size={40} />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={() => openModal(product)}
                                        className="bg-blue-500/80 hover:bg-blue-600 text-white p-2 rounded-full backdrop-blur-sm"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                        {product.category?.name || "Uncategorized"}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* PRODUCT MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-white dark:bg-[#1e293b] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-bold dark:text-white">
                                    {editingProduct ? "Edit Product" : "New Product"}
                                </h2>
                                <button onClick={closeModal} className="text-gray-500 hover:text-red-500">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
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

                                <input type="hidden" name="price" value={formData.price} />
                                <input type="hidden" name="stock" value={formData.stock} />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                    <div className="flex gap-2">
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                                        >
                                            <option value="">Select a Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat._id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsCategoryModalOpen(true)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                                            title="Add New Category"
                                        >
                                            <FolderPlus size={20} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className={`w-full font-bold py-3 rounded-lg transition-all mt-4 flex items-center justify-center gap-2 ${isSaving
                                        ? "bg-green-400 cursor-not-allowed text-white"
                                        : "bg-green-600 hover:bg-green-700 text-white"
                                        }`}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} /> Saving...
                                        </>
                                    ) : (
                                        "Save Product"
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MANAGE CATEGORIES MODAL */}
            <AnimatePresence>
                {isManageCategoriesOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold dark:text-white">Manage Categories</h3>
                                <button onClick={() => setIsManageCategoriesOpen(false)} className="text-gray-500 hover:text-red-500">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {categories.map(cat => (
                                    <div key={cat._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <span className="font-medium dark:text-white">{cat.name}</span>
                                        <button
                                            onClick={() => handleDeleteCategory(cat._id)}
                                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-full transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-semibold mb-2 dark:text-gray-300">Add New Category</h4>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="Category Name"
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                    <button
                                        onClick={handleCreateCategory}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ADD CATEGORY MODAL (Quick Add) */}
            <AnimatePresence>
                {isCategoryModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-2xl shadow-2xl p-6"
                        >
                            <h3 className="text-lg font-bold mb-4 dark:text-white">Add New Category</h3>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Category Name"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white mb-4"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateCategory}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Create
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

export default ProductManager;
