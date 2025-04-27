import { getImageUrl } from "@lib/getImageUrl";
import { Model } from "../../types/types";

const ModelCard = ({model}: {model: Model}) => {

  return (
    <div>
      <p>{model.name}</p>
      <img src={getImageUrl(model.imagePath)} alt={model.name}/>
    </div>
  )
}

export default ModelCard;