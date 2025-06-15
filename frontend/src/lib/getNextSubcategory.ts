import { Category } from "./getCategories";

export const getNextSubcategory = (
  categories: Category[],
  activeCategory: string,
  activeSubcategory: string
) => {
  const currentCategory = categories.find((c) => c.id === activeCategory);
  if (!currentCategory) return null;

  const currentSubIndex = currentCategory.subcategories.findIndex(
    (s) => s.id === activeSubcategory
  );

  // If there's another subcategory in the current category, return it
  if (currentSubIndex < currentCategory.subcategories.length - 1) {
    return {
      categoryId: activeCategory,
      subcategoryId: currentCategory.subcategories[currentSubIndex + 1].id,
    };
  }

  // Otherwise, find the next category
  const currentCategoryIndex = categories.findIndex(
    (c) => c.id === activeCategory
  );
  if (currentCategoryIndex < categories.length - 1) {
    const nextCategory = categories[currentCategoryIndex + 1];
    // Return the first subcategory of the next category
    return {
      categoryId: nextCategory.id,
      subcategoryId: nextCategory.subcategories[0].id,
    };
  }

  return null;
};
