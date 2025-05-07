import { useConfiguration } from '@context/ConfigurationContext';
import {
  EngineSelection, TransmissionsSelection, ExteriorColorSelection, RimsSelection,
  UpholsterySelection, AssistanceSelection, ComfortSelection, PricingPanel, ConfigurationReview
} from '../../panels';

interface ConfiguratorContentProps {
  activeSubcategory: string;
  completeConfiguration: () => void;
  goToSection: (category: string, subcategory: string) => void;
}

const ConfiguratorContent = ({ activeSubcategory, completeConfiguration, goToSection }: ConfiguratorContentProps) => {
  
  const {
    engines, selectedEngine, setSelectedEngine,
    transmissions, selectedTransmission, setSelectedTransmission,
    colors, selectedColor, setSelectedColor,
    rims, selectedRim, setSelectedRim,
    upholsteries, selectedUpholstery, setSelectedUpholstery,
    assistances, selectedAssistance, toggleAssistance,
    comforts, selectedComfort, toggleComfort,
    totalPrice
  } = useConfiguration();

  switch (activeSubcategory) {
    case 'engine':
      return (
        <EngineSelection
          engines={engines}
          selectedEngine={selectedEngine}
          handleSelectEngine={setSelectedEngine}
        />
      );
    case 'transmission':
      return (
        <TransmissionsSelection
          transmissions={transmissions}
          selectedTransmission={selectedTransmission}
          handleSelectTransmission={setSelectedTransmission}
        />
      );
    case 'exterior-color':
      return (
        <ExteriorColorSelection
          colors={colors}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
        />
      );
    case 'rims':
      return (
        <RimsSelection
          rims={rims}
          selectedRim={selectedRim}
          handleRimSelect={setSelectedRim}
        />
      );
    case 'upholstery':
      return (
        <UpholsterySelection
          upholsteries={upholsteries}
          selectedUpholstery={selectedUpholstery}
          handleSelectUpholstery={setSelectedUpholstery}
        />
      );
    case 'assistance':
      return (
        <AssistanceSelection
          assistances={assistances}
          selectedAssistance={selectedAssistance}
          handleSelectAssistance={toggleAssistance}
        />
      );
    case 'comfort':
      return (
        <ComfortSelection
          comforts={comforts}
          selectedComfort={selectedComfort}
          handleSelectComfort={toggleComfort}
        />
      );
    case 'pricing':
      return (
        <PricingPanel
          totalPrice={totalPrice}
        />
      );
    case 'review':
      return (
        <ConfigurationReview
          onComplete={completeConfiguration}
          onEditSection={goToSection}
        />
      );
    default:
      return null;
  }
}

export default ConfiguratorContent;