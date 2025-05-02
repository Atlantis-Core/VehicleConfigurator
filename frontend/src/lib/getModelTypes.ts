import { getModels } from "@api/api";

export async function getModelTypes(): Promise<String[]> {
  const models = await getModels();
  let modelTypes: string[] = [];
  models.forEach((model) => {
    if (!modelTypes.includes(model.type)) {
      modelTypes.push(model.type);
    }
  });
  return modelTypes;
}