const API_BASE_URL = import.meta.env.ECOMMERCE_API_URL || "";

/**
 * Get full image URL from backend path or object with url/path/image/imageUrl.
 */
export function getImageUrl(
  imagePath?: string | { url?: string; path?: string; image?: string; imageUrl?: string } | null
): string {
  if (!imagePath) return "";

  let path: string;
  if (typeof imagePath === "object") {
    path =
      imagePath.imageUrl || imagePath.url || imagePath.path || imagePath.image || "";
  } else if (typeof imagePath === "string") {
    path = imagePath;
  } else {
    return "";
  }

  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const baseUrl = API_BASE_URL.replace(/\/api\/?$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
