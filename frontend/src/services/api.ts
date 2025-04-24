const API_URL = import.meta.env.VITE_API_URL;

export async function getVehicleModels() {
  const res = await fetch(`${API_URL}/models`);
  return await res.json();
}