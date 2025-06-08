import {
  Color,
  Engine,
  Model,
  Rim,
  Transmission,
  Feature,
  Interior,
} from "../types/types";

export interface ConfigurationState {
  model: Model | undefined;
  rims: Rim[];
  colors: Color[];
  engines: Engine[];
  transmissions: Transmission[];
  upholsteries: Interior[];
  assistances: Feature[];
  comforts: Feature[];

  selectedColor: Color | undefined;
  selectedRim: Rim | undefined;
  selectedEngine: Engine | undefined;
  selectedTransmission: Transmission | undefined;
  selectedUpholstery: Interior | undefined;
  selectedAssistance: Feature[];
  selectedComfort: Feature[];

  loading: boolean;
  error: string | null;
}
