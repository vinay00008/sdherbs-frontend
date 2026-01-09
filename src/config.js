console.log("ENV CHECK → REACT_APP_API_URL =", process.env.REACT_APP_API_URL);

export const API_URL = process.env.REACT_APP_API_URL;
export const IMAGE_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '');

const config = {
    API_URL,
    IMAGE_BASE_URL
};

export default config;
