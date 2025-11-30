export const API_URL = process.env.REACT_APP_API_URL || "https://sdherbs-backend.onrender.com/api";
export const IMAGE_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || "https://sdherbs-backend.onrender.com";

const config = {
    API_URL,
    IMAGE_BASE_URL
};

export default config;
