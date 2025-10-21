export const extras = [
  {
    id: 'windows',
    label: 'Window Cleaning',
    price: 50,
    description: 'Interior and exterior window cleaning'
  },
  {
    id: 'fridge',
    label: 'Refrigerator Cleaning',
    price: 30,
    description: 'Deep clean inside and outside'
  },
  {
    id: 'oven',
    label: 'Oven Cleaning',
    price: 25,
    description: 'Deep clean oven and stovetop'
  },
  {
    id: 'cabinets',
    label: 'Cabinet Cleaning',
    price: 40,
    description: 'Interior and exterior cabinet cleaning'
  }
] as const;

export type ExtraService = typeof extras[number]['id'];