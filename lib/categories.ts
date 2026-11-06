export const CATEGORIES = [
  {
    slug: "joggers",
    label: "Joggers",
    description: "Everyday comfort in Ankara and cotton blends.",
  },
  {
    slug: "ankara-short",
    label: "Ankara Shorts",
    description: "Bold prints, tailored cuts — ready to wear.",
  },
  {
    slug: "ankara-gown",
    label: "Ankara Gowns",
    description: "Statement pieces for celebrations and events.",
  },
  {
    slug: "aso-oke-trouser",
    label: "Aso-Oke Trousers",
    description: "Handwoven Aso-Oke, cut for modern silhouettes.",
  },
  {
    slug: "aso-oke-skirt",
    label: "Aso-Oke Skirts",
    description: "Traditional weaving, contemporary styling.",
  },
  {
    slug: "aso-ebi-ladies",
    label: "Aso-Ebi (Ladies)",
    description: "Bulk orders for weddings and family events.",
  },
  {
    slug: "aso-oke-couples",
    label: "Aso-Oke for Couples",
    description: "Matching sets for traditional weddings.",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
