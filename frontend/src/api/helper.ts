import { getLocalCustomer } from "@hooks/useLocalCustomer";
import { Customer } from "../types/types";
import { getOrdersByCustomer } from "./getter";

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

export async function verifyCustomerCode(
  email: string,
  code: string
): Promise<boolean> {
  const response = await fetch(`${API_URL}/customers/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, code: code }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch models");
  }
  return (await response.json()).verified;
}

export async function countOrdersByLocalCustomer(): Promise<number> {
  const localCustomer = getLocalCustomer();
  if (!localCustomer) {
    return 0;
  }

  return (await getOrdersByCustomer(localCustomer.id)).orders.length;
}
