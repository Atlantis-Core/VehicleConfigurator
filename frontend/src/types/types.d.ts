export interface Order {
  id: string;
  customerId: number;
  configurationId: number;
  paymentOption: string;
  financing: string | null; // json with financing parameters (rate, months, ...)
  orderDate: string;
}

export interface FinancingObject {
  months: number;
  rate: string;
  monthlyPayment: number;
  totalAmount: number;
  label: string;
}

export interface OrderWithDetails extends Order {
  configuration: ConfigurationSummary;
}

export interface PaginationOrderResponse {
  orders: OrderWithDetails[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

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
  brand: string;
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
  brand: string;
  totalPrice: number;
}

type ConfigurationSummaryIncomplete = Partial<Omit<ConfigurationSummary, 'model'>> & { model: Model };

export interface Model {
  id: number;
  name: string;
  type: string;
  brand: string;
  basePrice: number;
  imagePath: string;
  model3dPath: string;
}

export interface Color {
  id: number;
  name: string;
  type: 'glossy' | 'matte' | 'metallic';
  brand: string;
  additionalPrice: number;
  hexCode?: string;         // optional
  materialName?: string;    // optional
}

export interface Rim {
  id: number;
  name: string;
  size: number;
  type: string;
  brand: string;
  additionalPrice: number;
  imagePath: string;
  rim3dModelPath?: string;
}

export interface Interior {
  id: number;
  name: string;
  material: string;
  brand: string;
  additionalPrice: number;
  imagePath: string;
}

export interface Engine {
  id: number;
  name: string;
  description: string;
  brand: string;
  additionalPrice: number;
}

export interface Transmission {
  id: number;
  name: string;
  brand: string;
}

export interface Feature {
  id: number;
  name: string;
  category: string;
  brand: string;
  additionalPrice: number;
  imagePath: string;
}

export interface BrandCompatible {
  brand: string;
}