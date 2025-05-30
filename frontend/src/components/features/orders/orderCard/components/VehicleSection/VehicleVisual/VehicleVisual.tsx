import { FaCarAlt } from 'react-icons/fa';
import { getImageUrl } from "@lib/getImageUrl";
import styles from "./VehicleVisual.module.css";
import { ConfigurationSummary } from "../../../../../types/types";

interface VehicleVisualProps {
  configuration: ConfigurationSummary;
}

const VehicleVisual: React.FC<VehicleVisualProps> = ({ configuration }) => {
  return (
    <div className={styles.vehicleVisual}>
      {configuration.model?.imagePath ? (
        <div className={styles.modelImage}>
          <img
            src={getImageUrl(configuration.model.imagePath)}
            alt={`${configuration.model?.name || 'Vehicle'} in ${configuration.selectedColor?.name || 'selected color'}`}
            className={styles.vehicleImage}
          />
        </div>
      ) : (
        <div className={styles.modelBadge} style={{
          backgroundColor: configuration.selectedColor?.hexCode || '#333',
          color: configuration.selectedColor?.hexCode ?? '#fff'
        }}>
          <FaCarAlt className={styles.vehicleIconLarge} />
          <span className={styles.modelName}>{configuration.model?.name}</span>
        </div>
      )}
    </div>
  );
};

export default VehicleVisual;