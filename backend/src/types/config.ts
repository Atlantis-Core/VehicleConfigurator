export interface SaveConfigurationDTO {
  id: number;
  customerId: number;
  modelId: number;
  engineId: number;
  transmissionId: number;
  colorId: number;
  interiorId: number;
  rimId: number;
  totalPrice: number;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
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
  //features: ConfigurationFeature[];
  //orders: Order[]
}

export interface Feature {
  id: number;
  name: string;
  category: string;
  brand: string;
  additionalPrice: number;
  imagePath: string;
}