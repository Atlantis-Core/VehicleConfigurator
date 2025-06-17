import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectConfiguration = (state: RootState) => state.configuration;

export const selectTotalPrice = createSelector(
  selectConfiguration,
  (config) => {
    return (
      (config.model?.basePrice || 0) +
      (config.selectedColor?.additionalPrice || 0) +
      (config.selectedRim?.additionalPrice || 0) +
      (config.selectedEngine?.additionalPrice || 0) +
      (config.selectedUpholstery?.additionalPrice || 0) +
      config.selectedAssistance.reduce(
        (sum, item) => sum + (item?.additionalPrice || 0),
        0
      ) +
      config.selectedComfort.reduce(
        (sum, item) => sum + (item?.additionalPrice || 0),
        0
      )
    );
  }
);

export const selectSelectedOptions = createSelector(
  selectConfiguration,
  (config) => ({
    selectedColor: config.selectedColor,
    selectedRim: config.selectedRim,
    selectedEngine: config.selectedEngine,
    selectedTransmission: config.selectedTransmission,
    selectedUpholstery: config.selectedUpholstery,
    selectedAssistance: config.selectedAssistance,
    selectedComfort: config.selectedComfort,
  })
);
