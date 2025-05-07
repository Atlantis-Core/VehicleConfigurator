import { ConfigurationSummaryIncomplete } from '../types/types';

const STORAGE_KEY = 'vehicleConfiguratorSaved';

export type SavedConfigurations = Record<string, ConfigurationSummaryIncomplete>;

export function saveConfigurationLocally(config: ConfigurationSummaryIncomplete) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed: SavedConfigurations = raw ? JSON.parse(raw) : {};
  parsed[config.model.id.toString()] = config;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
}

export function loadConfigurationLocally(modelId: number): ConfigurationSummaryIncomplete | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed: SavedConfigurations = JSON.parse(raw);
  return parsed[modelId.toString()] || null;
}

export function clearConfigurationLocally(modelId: number) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const parsed: SavedConfigurations = JSON.parse(raw);
  delete parsed[modelId.toString()];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
}

export function getAllSavedConfigurations(): SavedConfigurations {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}