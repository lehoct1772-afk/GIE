export interface BlueprintPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  ratio: string;
  symmetryGroup: string;
  formula: string;
  complexity: string;
  author: string;
  svgPath: string;
}

export interface BlueprintLibraryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  previewSvg: string;
  formula: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
  symmetryScore: number;
}

export const blueprintPresets: BlueprintPreset[] = [
  {
    id: 'crop-circle-001',
    name: 'Basic Crop Circle',
    category: 'Agricultural',
    description: 'Simple circular formation with central hub',
    ratio: '1:1',
    symmetryGroup: 'C8',
    formula: 'πr²',
    complexity: 'Low',
    author: 'GIE Research',
    svgPath: 'M12 2L2 7h5v2H7v6h3v12h-3v8h-2v-6h-3v-2h5L12 2z',
  },
  {
    id: 'crop-circle-002',
    name: 'Interlocking Circles',
    category: 'Geometric',
    description: 'Two overlapping circles with vesica piscis',
    ratio: '2:1',
    symmetryGroup: 'C6',
    formula: '(x² + y² - 1)² - x² - y² = 0',
    complexity: 'Medium',
    author: 'GIE Research',
    svgPath: 'M12 2L2 7h5v2H7v6h3v12h-3v8h-2v-6h-3v-2h5L12 2z',
  },
  {
    id: 'crop-circle-003',
    name: 'Flower of Life',
    category: 'Sacred Geometry',
    description: 'Multiple overlapping circles in hexagonal pattern',
    ratio: '1:1.5',
    symmetryGroup: 'C12',
    formula: 'Flower of Life sacred pattern',
    complexity: 'High',
    author: 'GIE Research',
    svgPath: 'M12 2L2 7h5v2H7v6h3v12h-3v8h-2v-6h-3v-2h5L12 2z',
  },
];

export const getBlueprints = (): BlueprintLibraryItem[] => {
  return blueprintPresets.map((bp) => ({
    id: bp.id,
    name: bp.name,
    category: bp.category,
    description: bp.description,
    previewSvg: bp.svgPath,
    formula: bp.formula,
    author: bp.author,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodeCount: Math.floor(Math.random() * 20) + 3,
    symmetryScore: Math.random(),
  }));
};

export const getBlueprintById = (id: string): BlueprintPreset | undefined => {
  return blueprintPresets.find((bp) => bp.id === id);
};

export const createBlueprint = (
  data: Omit<BlueprintPreset, 'id' | 'svgPath'> & { svgPath: string }
): BlueprintPreset => {
  const id = 'bp-' + Date.now();
  const newBlueprint: BlueprintPreset = { ...data, id, svgPath: data.svgPath };
  blueprintPresets.push(newBlueprint);
  return newBlueprint;
};

export const updateBlueprint = (
  id: string,
  data: Partial<Omit<BlueprintPreset, 'id' | 'svgPath'>>
): BlueprintPreset | undefined => {
  const index = blueprintPresets.findIndex((bp) => bp.id === id);
  if (index === -1) return undefined;

  blueprintPresets[index] = { ...blueprintPresets[index], ...data, svgPath: blueprintPresets[index].svgPath };
  return blueprintPresets[index];
};

export const deleteBlueprint = (id: string): boolean => {
  const index = blueprintPresets.findIndex((bp) => bp.id === id);
  if (index === -1) return false;
  blueprintPresets.splice(index, 1);
  return true;
};
