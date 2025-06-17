const STORAGE_KEY = "customerSession";

export interface CustomerSession {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
}

export function saveLocalCustomer(customerSession: CustomerSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customerSession));
}

export function getLocalCustomer(): CustomerSession | null {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function removeLocalCustomer() {
  localStorage.removeItem(STORAGE_KEY);
}
