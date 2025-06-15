export function filterComponentsByBrand<T extends { brand: string }>(
  items: T[],
  brand: string
): T[] {
  return items.filter((item) => item.brand === brand || brand === "All");
}
