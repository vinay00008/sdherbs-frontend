export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:10000/api";
export const IMAGE_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || "http://localhost:10000";

const config = {
    API_URL,
    IMAGE_BASE_URL
};

export default config;
