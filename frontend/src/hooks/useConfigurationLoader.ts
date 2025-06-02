import { useEffect, useRef } from "react";
import { useConfiguration } from "@context/ConfigurationContext";
import {
  loadConfigurationById,
  loadConfigurationsForModel,
  SavedConfiguration,
} from "@hooks/useLocalConfiguration";
import { toast } from "react-toastify";
import { Feature } from "../types/types";

export const useConfigurationLoader = (
  modelId: string | undefined,
  configurationId: string | undefined,
  loadedSavedConfig: string | null,
  setLoadedSavedConfig: (id: string | null) => void
) => {
  const justSaved = useRef(false);

  const {
    model,
    loadModelData,
    setSelectedColor,
    setSelectedRim,
    setSelectedEngine,
    setSelectedTransmission,
    setSelectedUpholstery,
    toggleAssistance,
    toggleComfort,
  } = useConfiguration();

  const preventNextAutoLoad = () => {
    justSaved.current = true;
  };

  const applyConfiguration = (config: SavedConfiguration) => {
    if (config.selectedColor) setSelectedColor(config.selectedColor);
    if (config.selectedRim) setSelectedRim(config.selectedRim);
    if (config.selectedEngine) setSelectedEngine(config.selectedEngine);
    if (config.selectedTransmission)
      setSelectedTransmission(config.selectedTransmission);
    if (config.selectedUpholstery)
      setSelectedUpholstery(config.selectedUpholstery);

    if (config.selectedAssistance && config.selectedAssistance.length > 0) {
      toggleAssistance(null);
      config.selectedAssistance.forEach((item: Feature) =>
        toggleAssistance(item)
      );
    }

    if (config.selectedComfort && config.selectedComfort.length > 0) {
      toggleComfort(null);
      config.selectedComfort.forEach((item: Feature) => toggleComfort(item));
    }
  };

  useEffect(() => {
    const loadAndApplyConfig = async () => {
      if (!modelId) return;

      await loadModelData(modelId);

      if (justSaved.current) {
        justSaved.current = false;
        return;
      }

      // Load specific configuration
      if (configurationId && loadedSavedConfig !== configurationId) {
        const savedConfig = loadConfigurationById(configurationId);

        if (savedConfig) {
          applyConfiguration(savedConfig);
          toast.info("Loaded your saved configuration", {
            toastId: "config-loaded-specific",
          });
          setLoadedSavedConfig(configurationId);
        } else {
          toast.error("Could not find the saved configuration", {
            toastId: "config-not-found",
          });
        }
        return;
      }

      // Load most recent configuration
      if (model && !configurationId && loadedSavedConfig === null) {
        const savedConfigs = loadConfigurationsForModel(parseInt(modelId));

        if (savedConfigs.length > 0) {
          const mostRecent = savedConfigs.sort(
            (a, b) =>
              new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
          )[0];

          applyConfiguration(mostRecent);
          toast.info("Loaded your most recent configuration", {
            toastId: "config-loaded-recent",
          });
          setLoadedSavedConfig("default");
        }
      }
    };

    loadAndApplyConfig();
  }, [modelId, model, configurationId, loadedSavedConfig]);

  return { preventNextAutoLoad };
};
