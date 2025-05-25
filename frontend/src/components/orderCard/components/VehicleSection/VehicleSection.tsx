import { ConfigurationSummary } from "../../../../types/types";
import VehicleDetails from "./VehicleDetails";
import styles from "./VehicleSection.module.css"
import VehicleVisual from "./VehicleVisual";

interface VehicleSectionProps {
  configuration: ConfigurationSummary;
}

const VehicleSection: React.FC<VehicleSectionProps> = ({ configuration }) => {
  return (
    <div className={styles.vehicleSection}>

      <VehicleVisual
        configuration={configuration}
      />

      <VehicleDetails
        configuration={configuration}
      />


    </div>
  );
};

export default VehicleSection;