export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  emailVerified: boolean;
}

export interface Configuration {
  id: number;
  customerId: number;
  modelId: number;
  engineId: number;
  transmissionId: number;
  colorId: number;
  interiorId: number;
  rimId: number;
  totalPrice: number;
  features: ConfigurationFeature[];
  //orders: Order[]
}

export interface ConfigurationFeature {
  configurationId: number;
  featureId: number;
}

export interface ConfigurationSummary {
  model: Model;
  selectedColor: Color;
  selectedRim: Rim;
  selectedEngine: Engine;
  selectedTransmission: Transmission;
  selectedUpholstery: Interior;
  selectedAssistance: Feature[];
  selectedComfort: Feature[];
  totalPrice: number;
}

export interface Model {
  id: number;
  name: string;
  type: string;
  basePrice: number;
  imagePath: string;
  model3dPath: string;
}

export interface Color {
  id: number;
  name: string;
  type: 'glossy' | 'matte' | 'metallic';
  additionalPrice: number;
  hexCode?: string;         // optional
  materialName?: string;    // optional
}

export interface Rim {
  id: number;
  name: string;
  size: number;
  type: string;
  additionalPrice: number;
  imagePath: string;
  rim3dModelPath?: string;   // optional
}

export interface Interior {
  id: number;
  name: string;
  material: string;
  additionalPrice: number;
  imagePath: string;
}

export interface Engine {
  id: number;
  name: string;
  description: string;
  additionalPrice: number;
}

export interface Transmission {
  id: number;
  name: string;
}

export interface Feature {
  id: number;
  name: string;
  category: string;
  additionalPrice: number;
  imagePath: string;
}