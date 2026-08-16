import { GeoNode, ActivityFeedItem, MathConstant, DataStream, ActiveUpload, BlueprintPreset } from '../types';

export const GEO_NODES: GeoNode[] = [
  {
    id: 'node-denver',
    name: 'Denver Grid Origin',
    lat: 39.7392,
    lng: -104.9903,
    latLabel: '39.7392° N',
    lngLabel: '104.9903° W',
    type: 'CORE',
    intensity: 0.95,
    connections: ['node-giza', 'node-athens', 'node-kyoto'],
    formula: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}'
  },
  {
    id: 'node-giza',
    name: 'Great Pyramid Vector',
    lat: 29.9792,
    lng: 31.1342,
    latLabel: '29.9792° N',
    lngLabel: '31.1342° E',
    type: 'HARMONIC',
    intensity: 0.98,
    connections: ['node-denver', 'node-stonehenge', 'node-teotihuacan'],
    formula: '\\phi = \\frac{1+\\sqrt{5}}{2} = 1.6180339...'
  },
  {
    id: 'node-athens',
    name: 'Parthenon Golden Node',
    lat: 37.9715,
    lng: 23.7267,
    latLabel: '37.9715° N',
    lngLabel: '23.7267° E',
    type: 'BLUEPRINT',
    intensity: 0.88,
    connections: ['node-denver', 'node-stonehenge'],
    formula: 'F_n = F_{n-1} + F_{n-2}'
  },
  {
    id: 'node-stonehenge',
    name: 'Salisbury Megalithic Circle',
    lat: 51.1789,
    lng: -1.8262,
    latLabel: '51.1789° N',
    lngLabel: '1.8262° W',
    type: 'HARMONIC',
    intensity: 0.85,
    connections: ['node-giza', 'node-athens', 'node-easter'],
    formula: '\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}'
  },
  {
    id: 'node-kyoto',
    name: 'Kyoto Imperial Lattice',
    lat: 35.0116,
    lng: 135.7681,
    latLabel: '35.0116° N',
    lngLabel: '135.7681° E',
    type: 'SATELLITE',
    intensity: 0.79,
    connections: ['node-denver', 'node-sydney'],
    formula: 'e^{i\\pi} + 1 = 0'
  },
  {
    id: 'node-teotihuacan',
    name: 'Pyramid of the Sun Harmonic',
    lat: 19.6925,
    lng: -98.8438,
    latLabel: '19.6925° N',
    lngLabel: '98.8438° W',
    type: 'HARMONIC',
    intensity: 0.91,
    connections: ['node-giza', 'node-machu'],
    formula: '\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\epsilon_0}'
  },
  {
    id: 'node-machu',
    name: 'Inca Celestial Meridian',
    lat: -13.1631,
    lng: -72.5450,
    latLabel: '13.1631° S',
    lngLabel: '72.5450° W',
    type: 'SATELLITE',
    intensity: 0.83,
    connections: ['node-teotihuacan', 'node-easter'],
    formula: 'A = \\pi r^2'
  },
  {
    id: 'node-sydney',
    name: 'Southern Helix Node',
    lat: -33.8688,
    lng: 151.2093,
    latLabel: '33.8688° S',
    lngLabel: '151.2093° E',
    type: 'SATELLITE',
    intensity: 0.77,
    connections: ['node-kyoto'],
    formula: '\\gamma = \\lim_{n \\to \\infty} \\left( \\sum \\frac{1}{k} - \\ln n \\right)'
  },
  {
    id: 'node-easter',
    name: 'Rapa Nui Island Node',
    lat: -27.1127,
    lng: -109.3497,
    latLabel: '27.1127° S',
    lngLabel: '109.3497° W',
    type: 'CORE',
    intensity: 0.93,
    connections: ['node-giza', 'node-machu', 'node-stonehenge'],
    formula: '\\phi^2 = \\phi + 1'
  }
];

export const INITIAL_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: 'act-1',
    text: 'New geometric relationship',
    timestamp: '09:29:31 UTC',
    timeAgo: '2s ago',
    type: 'DETECTED'
  },
  {
    id: 'act-2',
    text: 'Fibonacci sequence detected',
    timestamp: '09:29:29 UTC',
    timeAgo: '4s ago',
    type: 'INFO'
  },
  {
    id: 'act-3',
    text: 'Prime pattern recognized',
    timestamp: '09:29:26 UTC',
    timeAgo: '7s ago',
    type: 'DETECTED'
  },
  {
    id: 'act-4',
    text: 'Symmetry alignment verified',
    timestamp: '09:29:24 UTC',
    timeAgo: '9s ago',
    type: 'VERIFIED'
  },
  {
    id: 'act-5',
    text: 'Data correlation complete',
    timestamp: '09:29:22 UTC',
    timeAgo: '11s ago',
    type: 'CONFIRMED'
  },
  {
    id: 'act-6',
    text: 'Blueprint match confirmed',
    timestamp: '09:29:20 UTC',
    timeAgo: '13s ago',
    type: 'ANALYZED'
  },
  {
    id: 'act-7',
    text: 'Golden Ratio phi resonance mapped',
    timestamp: '09:29:15 UTC',
    timeAgo: '18s ago',
    type: 'VERIFIED'
  },
  {
    id: 'act-8',
    text: 'Icosahedron symmetry tensor normalized',
    timestamp: '09:29:10 UTC',
    timeAgo: '23s ago',
    type: 'CONFIRMED'
  }
];

export const MATH_CONSTANTS: MathConstant[] = [
  {
    symbol: 'π (PI)',
    name: 'Archimedes Constant',
    value: '3.141592653589793',
    fullValue: '3.14159265358979323846264338327950288419716939937510',
    formula: 'C / d',
    description: 'The ratio of a circle\'s circumference to its diameter in Euclidean space.',
    geometricSignificance: 'Found in spherical harmonic projections, wave physics, and circle squaring matrices.'
  },
  {
    symbol: 'ϕ (PHI)',
    name: 'Golden Ratio',
    value: '1.618033988749895',
    fullValue: '1.61803398874989484820458683436563811772030917980576',
    formula: '(1 + √5) / 2',
    description: 'The divine proportion where the ratio of two quantities equals the ratio of their sum to the larger.',
    geometricSignificance: 'Governs logarithmic spiral lattices, pentagonal symmetry, and pentagram proportions.'
  },
  {
    symbol: 'e (E)',
    name: 'Euler\'s Number',
    value: '2.718281828459045',
    fullValue: '2.71828182845904523536028747135266249775724709369995',
    formula: 'lim_{n→∞} (1 + 1/n)^n',
    description: 'The base of the natural logarithm representing continuous growth and decay rates.',
    geometricSignificance: 'Underpins catenary curves, complex exponentiation, and wave phase shifts.'
  },
  {
    symbol: '√2',
    name: 'Pythagoras Constant',
    value: '1.414213562373095',
    fullValue: '1.41421356237309504880168872420969807856967187537694',
    formula: 'd_{square} / s',
    description: 'The positive real number that, when multiplied by itself, equals the number 2.',
    geometricSignificance: 'Diagonal length of a unit square; foundational to ISO 216 paper ratios and octagonal symmetry.'
  },
  {
    symbol: 'γ (EULER)',
    name: 'Euler-Mascheroni Constant',
    value: '0.577215664901532',
    fullValue: '0.57721566490153286060651209008240243104215933593992',
    formula: 'lim_{n→∞} (∑ 1/k - ln n)',
    description: 'The limiting difference between the harmonic series and the natural logarithm.',
    geometricSignificance: 'Appears in prime distribution bounds, quantum field regularizations, and fractal dimensioning.'
  },
  {
    symbol: 'α (FINE STR)',
    name: 'Sommerfeld Constant',
    value: '0.0072973525693',
    fullValue: '0.007297352569311',
    formula: 'e^2 / (4π ε_0 ℏ c) ≈ 1/137.035999',
    description: 'The coupling constant characterizing the strength of electromagnetic interaction between elementary charged particles.',
    geometricSignificance: 'Dictates atomic energy level splitting and cosmic geometric spacing ratios.'
  }
];

export const DATA_STREAMS: DataStream[] = [
  {
    id: 'ds-1',
    name: 'Geometric Data',
    value: '4.21M',
    rawBytes: 4210000,
    percent: 48.6,
    color: '#00f0ff'
  },
  {
    id: 'ds-2',
    name: 'Image Analysis',
    value: '2.18M',
    rawBytes: 2180000,
    percent: 25.2,
    color: '#00ff9d'
  },
  {
    id: 'ds-3',
    name: 'Pattern Recognition',
    value: '1.45M',
    rawBytes: 1450000,
    percent: 16.7,
    color: '#ffb700'
  },
  {
    id: 'ds-4',
    name: 'Mathematical Proofs',
    value: '521K',
    rawBytes: 521000,
    percent: 6.0,
    color: '#bf5af2'
  },
  {
    id: 'ds-5',
    name: 'Cross Correlations',
    value: '273K',
    rawBytes: 273000,
    percent: 3.5,
    color: '#ff2d55'
  }
];

export const INITIAL_UPLOADS: ActiveUpload[] = [
  {
    id: 'up-1',
    filename: 'IMG_2026_07_31_001.jpg',
    status: 'Analyzing',
    progress: 76,
    fileType: 'image',
    size: '14.2 MB',
    extractedNodes: 142,
    symmetryScore: 94.2
  },
  {
    id: 'up-2',
    filename: 'Blueprint_Staircase.dwg',
    status: 'Queued',
    progress: 45,
    fileType: 'cad',
    size: '8.7 MB',
    extractedNodes: 89,
    symmetryScore: 88.6
  },
  {
    id: 'up-3',
    filename: 'Field_Survey_003.pdf',
    status: 'Queued',
    progress: 12,
    fileType: 'pdf',
    size: '4.1 MB',
    extractedNodes: 34,
    symmetryScore: 91.0
  }
];

export const BLUEPRINT_PRESETS: BlueprintPreset[] = [
  {
    id: 'bp-parthenon',
    name: 'Parthenon Facade Golden Rectangles',
    category: 'Sacred Architecture',
    description: 'Classical Greek architectural proportions based on 1:1.618 golden rectangle ratios and root-5 dynamic symmetry.',
    ratio: '1.6180 (Phi)',
    symmetryGroup: 'C2v Symmetry',
    formula: 'H/W = \\frac{1}{\\phi} \\approx 0.618',
    complexity: 'High',
    author: 'Iktinos & Kallikrates (447 BC)',
    svgPath: 'M10 90 L90 90 L90 30 L50 10 L10 30 Z'
  },
  {
    id: 'bp-giza',
    name: 'Great Pyramid Apex Geometry',
    category: 'Ancient Geodesy',
    description: 'Slope angle of 51°50\'40" encoding Pi and Golden Ratio simultaneously: perimeter divided by twice height equals Pi.',
    ratio: '4 / Pi = 1.2732',
    symmetryGroup: 'D4 Pyramidal',
    formula: '\\tan(\\theta) = \\frac{4}{\\pi} \\approx 1.273',
    complexity: 'Masterwork',
    author: 'Hemiunu (c. 2560 BC)',
    svgPath: 'M50 10 L90 85 L10 85 Z'
  },
  {
    id: 'bp-flower-of-life',
    name: 'Flower of Life 19-Circle Grid',
    category: 'Sacred Geometry',
    description: '19 intersecting circles that generate Platonic solids, Metatron\'s Cube, and the Tree of Life array.',
    ratio: '1.000 (Hexagonal Lattice)',
    symmetryGroup: 'D6 Planar Symmetry',
    formula: 'r_n = r_0 \\cdot e^{i n \\pi / 3}',
    complexity: 'Harmonic',
    author: 'Universal Geometry',
    svgPath: 'M50 50 m-30 0 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0'
  },
  {
    id: 'bp-dna-helix',
    name: 'B-DNA Double Helix Cross-Section',
    category: 'Biomolecular Blueprint',
    description: '34 Angstrom pitch, 20 Angstrom diameter, major/minor grooves following 34/21 Fibonacci number ratio.',
    ratio: '34 / 21 = 1.6190',
    symmetryGroup: 'C10 Helical',
    formula: 'z(t) = c t, x(t) = R \\cos(\\omega t)',
    complexity: 'Extreme',
    author: 'Nature / Watson & Crick',
    svgPath: 'M20 20 Q 50 80 80 20 Q 50 80 20 20'
  },
  {
    id: 'bp-mandelbrot',
    name: 'Mandelbrot Fractal Boundary',
    category: 'Complex Dynamics',
    description: 'Self-similar boundary generated by iterative complex quadratic map z_n+1 = z_n^2 + c.',
    ratio: 'Feigenbaum delta (4.6692)',
    symmetryGroup: 'Conformal Invariance',
    formula: 'z_{n+1} = z_n^2 + c',
    complexity: 'Infinite',
    author: 'Benoit Mandelbrot (1980)',
    svgPath: 'M10 50 Q 30 10 50 50 T 90 50'
  }
];
