import { ConfigurationSummaryIncomplete } from '../types/types';

const STORAGE_KEY = 'vehicleConfiguratorSaved';

export interface SavedConfiguration extends ConfigurationSummaryIncomplete {
  id: string; // Unique ID for each configuration
  savedAt: string; // Timestamp to show when it was saved
}

export type SavedConfigurations = Record<string, SavedConfiguration>;

// Generate a unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function saveConfigurationLocally(config: ConfigurationSummaryIncomplete) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed: SavedConfigurations = raw ? JSON.parse(raw) : {};
  
  // Create a uniquely identified configuration
  const savedConfig: SavedConfiguration = {
    ...config,
    id: generateId(),
    savedAt: new Date().toISOString()
  };
  
  parsed[savedConfig.id] = savedConfig;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  
  return savedConfig.id;
}

export function loadConfigurationById(id: string): SavedConfiguration | null {
  const configs = getAllSavedConfigurations();
  return configs[id] || null;
}

// Load configurations for a specific model
export function loadConfigurationsForModel(modelId: number): SavedConfiguration[] {
  const configs = getAllSavedConfigurations();
  return Object.values(configs).filter(config => 
    config.model.id === modelId
  );
}

export function deleteConfigurationLocally(id: string) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const parsed: SavedConfigurations = JSON.parse(raw);
  delete parsed[id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  console.log(`Deleted config with id ${id}`)
}

export function getAllSavedConfigurations(): SavedConfigurations {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

// Get the count of saved configurations
export function getSavedConfigurationsCount(): number {
  const configs = getAllSavedConfigurations();
  return Object.keys(configs).length;
}