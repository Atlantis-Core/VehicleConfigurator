import { useAppSelector } from '@store/hooks';
import { selectConfiguration } from '@store/selectors';
import {
  EngineSelection,
  AssistanceSelection,
  ComfortSelection,
  ExteriorColorSelection,
  RimsSelection,
  TransmissionsSelection,
  UpholsterySelection,
  PricingPanel,
  ConfigurationReview,
} from '../panels';

interface ConfiguratorContentProps {
  activeSubcategory: string;
  completeConfiguration: () => void;
  goToSection: (category: string, subcategory: string) => void;
}

const ConfiguratorContent = ({ 
  activeSubcategory, 
  completeConfiguration, 
  goToSection 
}: ConfiguratorContentProps) => {
  const { loading } = useAppSelector(selectConfiguration);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading configuration options...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSubcategory) {
      case 'engine':
        return <EngineSelection />;
      case 'transmission':
        return <TransmissionsSelection />;
      case 'exterior-color':
        return <ExteriorColorSelection />;
      case 'rims':
        return <RimsSelection />;
      case 'upholstery':
        return <UpholsterySelection />;
      case 'assistance':
        return <AssistanceSelection />;
      case 'comfort':
        return <ComfortSelection />;
      case 'pricing':
        return <PricingPanel />;
      case 'review':
        return (
          <ConfigurationReview
            completeConfiguration={completeConfiguration}
            goToSection={goToSection}
          />
        );
      default:
        return <div>Select a configuration option from the sidebar</div>;
    }
  };

  return <div>{renderContent()}</div>;
};

export default ConfiguratorContent;