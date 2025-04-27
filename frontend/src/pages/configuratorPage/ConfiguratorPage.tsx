import { useEffect, useState } from "react";
import styles from "./ConfiguratorPage.module.css";
import VehicleViewer from "@components/3DCarModel/VehicleViewer";
import { Model } from "../../types/types";
import { getModels } from "@api/api";
import MercedesIcon from "../../assets/icons/mercedes_star.svg";
import { useNavigate } from "react-router-dom";
import ModelCard from "@components/modelCard";

const ConfiguratorPage = () => {

  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)

  const navigate = useNavigate();

  useEffect(() => {
    const fetchModels = async () => {
      setModels(await getModels())
    }

    fetchModels();
  }, [])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={MercedesIcon} alt="mercedes star" onClick={() => navigate("/")}/>
      </header>

      <div className={styles.upperSection}>
        <p className={styles.upperSectionTitle}>
          Available Models
        </p>
        <p className={styles.upperSectionSubTitle}>
          Explore our selection of premium vehicles and find the perfect model that matches your style and needs. Each vehicle can be customized to your exact specifications.
        </p>
      </div>

      { /* Select a vehicle Model */}
      <div>
        { models.map((model) => (
            <ModelCard model={model}/>
          ))
        }
      </div>
    </div>
  )
}

export default ConfiguratorPage;