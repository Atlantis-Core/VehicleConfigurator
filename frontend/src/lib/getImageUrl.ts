const STORAGE_URL = import.meta.env.VITE_API_URL;

export function getImageUrl(imagePath: string): string {
  if (!STORAGE_URL) {
    console.error('Could not find StorageURL; imageURL is wrong!');
  }
  return `${STORAGE_URL}/storage/${imagePath}`;
}