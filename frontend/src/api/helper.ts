import { Customer } from "../types/types";

const API_URL = import.meta.env.VITE_API_URL;

// Fetch order from
export async function findCustomerByEmail(email: string): Promise<Customer> {
  const response = await fetch(`${API_URL}/customers/find-by-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch models");
  }
  return await response.json();
}

export async function verifyCustomer(email: string): Promise<boolean> {
  const response = await fetch(`${API_URL}/customers/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch models");
  }
  return (await response.json()).success;
}
