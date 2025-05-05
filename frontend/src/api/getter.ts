import { Model, Color, Rim, Interior, Feature, Engine, Transmission } from "../types/types";

const API_URL = import.meta.env.VITE_API_URL

// Fetch all car models
export async function getModels(): Promise<Model[]> {
  const response = await fetch(`${API_URL}/models`);
  if (!response.ok) {
    throw new Error('Failed to fetch models');
  }
  return await response.json();
}

// Fetch all colors
export async function getColors(): Promise<Color[]> {
  const response = await fetch(`${API_URL}/colors`);
  if (!response.ok) {
    throw new Error('Failed to fetch colors');
  }
  return await response.json();
}

// Fetch all rims
export async function getRims(): Promise<Rim[]> {
  const response = await fetch(`${API_URL}/rims`);
  if (!response.ok) {
    throw new Error('Failed to fetch rims');
  }
  return await response.json();
}

// Fetch all interiors
export async function getInteriors(): Promise<Interior[]> {
  const response = await fetch(`${API_URL}/interiors`);
  if (!response.ok) {
    throw new Error('Failed to fetch interiors');
  }
  return await response.json();
}

// Fetch all features
export async function getFeatures(): Promise<Feature[]> {
  const response = await fetch(`${API_URL}/features`);
  if (!response.ok) {
    throw new Error('Failed to fetch features');
  }
  return await response.json();
}

// Fetch all engines
export async function getEngines(): Promise<Engine[]> {
  const response = await fetch(`${API_URL}/engines`);
  if (!response.ok) {
    throw new Error('Failed to fetch engines');
  }
  return await response.json();
}

// Fetch all transmissions
export async function getTransmissions(): Promise<Transmission[]> {
  const response = await fetch(`${API_URL}/transmissions`);
  if (!response.ok) {
    throw new Error('Failed to fetch transmissions');
  }
  return await response.json();
}