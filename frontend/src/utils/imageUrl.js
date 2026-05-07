import API_BASE_URL from "../services/api";

const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    const normalizedPath = String(imagePath).trim().replace(/\\/g, "/");

    if (/^https?:\/\//i.test(normalizedPath)) {
        return normalizedPath;
    }

    const cleanPath = normalizedPath.replace(/^\/+/, "");

    if (cleanPath.startsWith("uploads/")) {
        return `${API_BASE_URL}/${cleanPath}`;
    }

    return `${API_BASE_URL}/uploads/${cleanPath}`;
};

export const getPlaceholderUrl = (width = 300, height = 220, text = "No Image") => {
    return `https://placehold.co/${width}x${height}?text=${encodeURIComponent(text)}`;
};

export default getImageUrl;