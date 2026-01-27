export const ECOMMERCE_ACCESS_TOKEN = 'ecommerce-access-token';

export const ECOMMERCE_REFERSH_TOKEN = 'ecommerce-refresh-token';

// Backend API URL for images
export const API_BASE_URL = import.meta.env.ECOMMERCE_API_URL || '';

// Helper to get full image URL (removes /api suffix from base URL)
export const getImageUrl = (imagePath?: string | { url?: string; path?: string } | unknown): string => {
    if (!imagePath) return '';
    
    // Handle if imagePath is an object with url/path/image/imageUrl property
    let path: string;
    if (typeof imagePath === 'object' && imagePath !== null) {
        const imgObj = imagePath as { url?: string; path?: string; image?: string; imageUrl?: string };
        path = imgObj.imageUrl || imgObj.url || imgObj.path || imgObj.image || '';
    } else if (typeof imagePath === 'string') {
        path = imagePath;
    } else {
        return '';
    }
    
    if (!path) return '';
    
    // If already a full URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    // Remove /api suffix from base URL for static file serving
    const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
};