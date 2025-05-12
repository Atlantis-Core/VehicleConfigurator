import { BrandCompatible } from "../types/types";

export function filterComponentsByBrand<T extends BrandCompatible>(
  items: T[],
  brand: string
): T[] {
  return items.filter((item) => item.brand === brand || brand === 'All');
}
