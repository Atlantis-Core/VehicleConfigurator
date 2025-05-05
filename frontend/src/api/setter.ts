import { ConfigurationSummary, Customer } from "../types/types";

const API_URL = import.meta.env.VITE_API_URL


export async function saveConfiguration(config: ConfigurationSummary, customerId: number): Promise<string> {
  
  const configPayload = {
    customerId: customerId,
    modelId: config.model.id,
    engineId: config.selectedEngine?.id || undefined,
    transmissionId: config.selectedTransmission?.id || undefined,
    colorId: config.selectedColor?.id || undefined,
    rimId: config.selectedRim?.id || undefined,
    interiorId: config.selectedUpholstery?.id || undefined,
    totalPrice: config.totalPrice || 0,
    features: []
  }

  console.log("Save Configuration: ", configPayload)
  
  const response = await fetch(`${API_URL}/configurations/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(configPayload)
  })

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save configuration: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  return result.message || "Saved successfully";
}

export async function findOrCreateCustomer(customer: Customer): Promise<Customer> {
  const response = await fetch(`${API_URL}/customers/find-or-create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to find or create customer: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  return result as Customer;
}