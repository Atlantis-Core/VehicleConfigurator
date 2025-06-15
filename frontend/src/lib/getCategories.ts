export interface SubCategory {
  id: string;
  label: string;
}

export interface Category {
  id: string;
  label: string;
  subcategories: SubCategory[];
}

export const getCategories = (): Category[] => {
  return [
    {
      id: "motorization",
      label: "Motorization",
      subcategories: [
        { id: "engine", label: "Engine" },
        { id: "transmission", label: "Transmission" },
      ],
    },
    {
      id: "exterior",
      label: "Exterior",
      subcategories: [
        { id: "exterior-color", label: "Exterior Color" },
        { id: "rims", label: "Wheels & Rims" },
      ],
    },
    {
      id: "interior",
      label: "Interior",
      subcategories: [{ id: "upholstery", label: "Upholstery" }],
    },
    {
      id: "features",
      label: "Features",
      subcategories: [
        { id: "assistance", label: "Assistance Systems" },
        { id: "comfort", label: "Comfort Features" },
      ],
    },
    {
      id: "summary",
      label: "Summary",
      subcategories: [
        { id: "pricing", label: "Financing options" },
        { id: "review", label: "Review & Complete" },
      ],
    },
  ];
};
