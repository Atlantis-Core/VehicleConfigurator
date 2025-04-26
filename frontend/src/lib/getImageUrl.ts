const BACKEND_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5001";

export function getImageUrl(imagePath: string): string {
  return `${BACKEND_URL}${imagePath}`;
}