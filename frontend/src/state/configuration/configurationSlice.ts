import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getColors,
  getEngines,
  getModels,
  getRims,
  getTransmissions,
  getFeatures,
  getInteriors,
} from "@api/getter";
import {
  Color,
  Engine,
  Rim,
  Transmission,
  Feature,
  Interior,
} from "../../types/types";
import { filterComponentsByBrand } from "@utils/filterComponentsByBrand";
import { toast } from "react-toastify";
import { ConfigurationState } from "./types";
import { loadConfigurationById } from "@state/localStorage/useLocalConfiguration";

const initialState: ConfigurationState = {
  model: undefined,
  rims: [],
  colors: [],
  engines: [],
  transmissions: [],
  upholsteries: [],
  assistances: [],
  comforts: [],
  selectedColor: undefined,
  selectedRim: undefined,
  selectedEngine: undefined,
  selectedTransmission: undefined,
  selectedUpholstery: undefined,
  selectedAssistance: [],
  selectedComfort: [],
  completedSteps: {},
  loading: false,
  error: null,
};

export const loadModelData = createAsyncThunk(
  "configuration/loadModelData",
  async (modelId: string, { rejectWithValue }) => {
    try {
      const [
        models,
        rims,
        colors,
        engines,
        transmissions,
        interiors,
        features,
      ] = await Promise.all([
        getModels(),
        getRims(),
        getColors(),
        getEngines(),
        getTransmissions(),
        getInteriors(),
        getFeatures(),
      ]);

      const foundModel = models.find((m) => m.id === parseInt(modelId || ""));
      if (!foundModel) {
        toast.error("Error while trying to load configurations.");
        return rejectWithValue("Model not found");
      }

      return {
        model: foundModel,
        rims: filterComponentsByBrand(rims, foundModel.brand),
        colors: filterComponentsByBrand(colors, foundModel.brand),
        engines: filterComponentsByBrand(engines, foundModel.brand),
        transmissions: filterComponentsByBrand(transmissions, foundModel.brand),
        upholsteries: filterComponentsByBrand(interiors, foundModel.brand),
        assistances: filterComponentsByBrand(
          features.filter((feature) => feature.category === "assistance"),
          foundModel.brand
        ),
        comforts: filterComponentsByBrand(
          features.filter((feature) => feature.category === "comfort"),
          foundModel.brand
        ),
      };
    } catch (error) {
      console.error("Error loading config data:", error);
      return rejectWithValue("Failed to load configuration data");
    }
  }
);

export const loadSavedConfiguration = createAsyncThunk(
  "configuration/loadSavedConfiguration",
  async (configurationId: string, { rejectWithValue, dispatch }) => {
    try {
      const savedConfig = loadConfigurationById(configurationId);

      if (!savedConfig || !savedConfig.model) {
        return rejectWithValue(
          `Saved configuration '${configurationId}' not found`
        );
      }

      const modelResult = await dispatch(
        loadModelData(savedConfig.model.id.toString())
      );

      if (loadModelData.rejected.match(modelResult)) {
        return rejectWithValue(
          `Failed to load model data for saved configuration`
        );
      }

      return {
        savedConfig,
        selectedColor: savedConfig.selectedColor,
        selectedRim: savedConfig.selectedRim,
        selectedEngine: savedConfig.selectedEngine,
        selectedTransmission: savedConfig.selectedTransmission,
        selectedUpholstery: savedConfig.selectedUpholstery,
        selectedAssistance: savedConfig.selectedAssistance || [],
        selectedComfort: savedConfig.selectedComfort || [],
      };
    } catch (error) {
      console.error("Error loading saved configuration:", error);
      return rejectWithValue("Failed to load saved configuration");
    }
  }
);

const configurationSlice = createSlice({
  name: "configuration",
  initialState,
  reducers: {
    setSelectedColor: (state, action: PayloadAction<Color>) => {
      state.selectedColor = action.payload;
    },
    setSelectedRim: (state, action: PayloadAction<Rim>) => {
      state.selectedRim = action.payload;
    },
    setSelectedEngine: (state, action: PayloadAction<Engine>) => {
      state.selectedEngine = action.payload;
    },
    setSelectedTransmission: (state, action: PayloadAction<Transmission>) => {
      state.selectedTransmission = action.payload;
    },
    setSelectedUpholstery: (state, action: PayloadAction<Interior>) => {
      state.selectedUpholstery = action.payload;
    },
    toggleAssistance: (state, action: PayloadAction<Feature | null>) => {
      if (action.payload === null) {
        state.selectedAssistance = [];
      } else {
        const existingIndex = state.selectedAssistance.findIndex(
          (item) => item.id === action.payload!.id
        );
        if (existingIndex >= 0) {
          state.selectedAssistance.splice(existingIndex, 1);
        } else {
          state.selectedAssistance.push(action.payload);
        }
      }
    },
    toggleComfort: (state, action: PayloadAction<Feature | null>) => {
      if (action.payload === null) {
        state.selectedComfort = [];
      } else {
        const existingIndex = state.selectedComfort.findIndex(
          (item) => item.id === action.payload!.id
        );
        if (existingIndex >= 0) {
          state.selectedComfort.splice(existingIndex, 1);
        } else {
          state.selectedComfort.push(action.payload);
        }
      }
    },
    resetConfiguration: (state) => {
      state.selectedColor = undefined;
      state.selectedRim = undefined;
      state.selectedEngine = undefined;
      state.selectedTransmission = undefined;
      state.selectedUpholstery = undefined;
      state.selectedAssistance = [];
      state.selectedComfort = [];

      resetCompletedSteps();
    },
    updateCompletedSteps: (
      state,
      action: PayloadAction<Record<string, boolean>>
    ) => {
      state.completedSteps = { ...state.completedSteps, ...action.payload };
    },
    resetCompletedSteps: (state) => {
      state.completedSteps = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadModelData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.completedSteps = {};
      })
      .addCase(loadModelData.fulfilled, (state, action) => {
        state.loading = false;
        state.model = action.payload.model;
        state.rims = action.payload.rims;
        state.colors = action.payload.colors;
        state.engines = action.payload.engines;
        state.transmissions = action.payload.transmissions;
        state.upholsteries = action.payload.upholsteries;
        state.assistances = action.payload.assistances;
        state.comforts = action.payload.comforts;
        state.selectedColor = undefined;
        state.selectedRim = undefined;
        state.selectedEngine = undefined;
        state.selectedTransmission = undefined;
        state.selectedUpholstery = undefined;
        state.selectedAssistance = [];
        state.selectedComfort = [];
        state.completedSteps = {};
      })
      .addCase(loadModelData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(loadSavedConfiguration.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.completedSteps = {};
      })
      .addCase(loadSavedConfiguration.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedColor = action.payload.selectedColor;
        state.selectedRim = action.payload.selectedRim;
        state.selectedEngine = action.payload.selectedEngine;
        state.selectedTransmission = action.payload.selectedTransmission;
        state.selectedUpholstery = action.payload.selectedUpholstery;
        state.selectedAssistance = action.payload.selectedAssistance;
        state.selectedComfort = action.payload.selectedComfort;
        state.error = null;

        const newCompletedSteps: Record<string, boolean> = {};
        if (action.payload.selectedColor)
          newCompletedSteps["exterior-color"] = true;
        if (action.payload.selectedRim) newCompletedSteps["rims"] = true;
        if (action.payload.selectedEngine) newCompletedSteps["engine"] = true;
        if (action.payload.selectedTransmission)
          newCompletedSteps["transmission"] = true;
        if (action.payload.selectedUpholstery)
          newCompletedSteps["upholstery"] = true;

        state.completedSteps = newCompletedSteps;
      })
      .addCase(loadSavedConfiguration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedColor,
  setSelectedRim,
  setSelectedEngine,
  setSelectedTransmission,
  setSelectedUpholstery,
  toggleAssistance,
  toggleComfort,
  resetConfiguration,
  updateCompletedSteps,
  resetCompletedSteps,
} = configurationSlice.actions;

export default configurationSlice.reducer;
