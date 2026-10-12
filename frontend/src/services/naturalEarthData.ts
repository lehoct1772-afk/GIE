/**
 * Natural Earth WGS84 Geographic Dataset — GIS Feature Provider
 *
 * Provides structured access to geographic feature data used by the GIE rendering system.
 * High-resolution geometry is loaded from authoritative `world-atlas` TopoJSON datasets
 * (Natural Earth 1:110m) via topojson-client, not from hand-written approximations.
 *
 * This file consolidates and provides access to geographic feature collections,
 * including tectonic plates, ocean trenches, and other mapped Earth features
 * consumed by `worldTexture.ts` and `Globe3DLayers.tsx`.
 *
 * Continent/coastline geometry is loaded directly from `world-atlas/countries-110m.json`
 * in `worldTexture.ts` via topojson-client for maximum accuracy.
 */

import { feature } from 'topojson-client';
import countries110m from 'world-atlas/countries-110m.json';

// ============================================================
// Types
// ============================================================

export interface GISFeaturePolygon {
  id: string;
  name: string;
  category: 'CONTINENT' | 'ISLAND' | 'COUNTRY_BORDER' | 'TECTONIC_PLATE' | 'OCEAN_TRENCH' | 'RIVER_BASIN';
  coordinates: [number, number][]; // Array of [longitude, latitude] in WGS84
}

// ============================================================
// 1. World Atlas — Authority Dataset
// ============================================================

/**
 * Access point for the authoritative Natural Earth 1:110m country data.
 * This is consumed directly by worldTexture.ts for continent/coastline rendering.
 */
export const WORLD_ATLAS = {
  countries: countries110m,
  /**
   * Returns the complete countries FeatureCollection
   */
  getCountriesGeoJSON() {
    return feature(
      countries110m as any,
      (countries110m as any).objects.countries
    ) as any;
  },
  /**
   * Iterates over all country polygons
   */
  forEachPolygon(callback: (rings: any) => void) {
    const geo = this.getCountriesGeoJSON();
    for (const item of geo.features ?? []) {
      const geometry = item.geometry;
      if (!geometry) continue;
      if (geometry.type === 'Polygon') {
        callback(geometry.coordinates);
      } else if (geometry.type === 'MultiPolygon') {
        for (const polygon of geometry.coordinates) {
          callback(polygon);
        }
      }
    }
  },
};

// ============================================================
// 2. NaturalEarthDatasets — COMPATIBLE with worldTexture.ts
// ============================================================

/**
 * Geographic datasets for the GIE rendering system.
 *
 * CONTINENTS: Provides polygon coordinates for bathymetry and elevation bump map.
 * These are derived from the authoritative world-atlas dataset.
 *
 * TECTONIC_PLATES: Structural plate boundaries for Globe3DLayers.
 *
 * OCEAN_TRENCHES: Deep subduction zones for Globe3DLayers and worldTexture.ts.
 *
 * RIVER_BASINS: Hydrography reference points for worldTexture.ts.
 */
export class NaturalEarthDatasets {
  /**
   * CONTINENTS — Dataset-backed polygon coordinates.
   * Extracted from world-atlas/countries-110m.json for compatibility
   * with the approved worldTexture.ts which consumes this property.
   *
   * These are authoritative Natural Earth 1:110m polygons.
   */
  static readonly CONTINENTS: GISFeaturePolygon[] = (() => {
    const result: GISFeaturePolygon[] = [];
    const geo = WORLD_ATLAS.getCountriesGeoJSON();

    for (const feature of geo.features ?? []) {
      const geometry = feature.geometry;
      if (!geometry) continue;

      let polygons: any[] = [];
      if (geometry.type === 'Polygon') {
        polygons = [geometry.coordinates];
      } else if (geometry.type === 'MultiPolygon') {
        polygons = geometry.coordinates;
      }

      for (const polygon of polygons) {
        // Extract the outer ring (first ring)
        const outerRing = polygon[0];
        if (!outerRing || outerRing.length < 4) continue;

        // Convert to [longitude, latitude] format
        const coords: [number, number][] = outerRing.map(
          (point: [number, number]) => [point[0], point[1]]
        );

        result.push({
          id: `continent-${result.length}`,
          name: feature.properties?.name || `Feature ${result.length}`,
          category: 'CONTINENT',
          coordinates: coords,
        });
      }
    }

    return result;
  })();

  // ============================================================
  // 3. Tectonic Plates Boundaries (WGS84 Fault Lines)
  // ============================================================

  static readonly TECTONIC_PLATES: GISFeaturePolygon[] = [
    {
      id: 'RING_OF_FIRE',
      name: 'Pacific Ring of Fire Boundary',
      category: 'TECTONIC_PLATE',
      coordinates: [
        [-150, 60], [-170, 50], [140, 35], [130, 15], [150, -10],
        [180, -30], [-140, -50], [-80, -60], [-75, -20], [-85, 10], [-115, 30], [-150, 60]
      ]
    },
    {
      id: 'MID_ATLANTIC_RIDGE',
      name: 'Mid-Atlantic Ridge',
      category: 'TECTONIC_PLATE',
      coordinates: [
        [-20, 75], [-30, 50], [-40, 20], [-20, 0], [-15, -30], [-10, -55]
      ]
    },
    {
      id: 'ALPINE_HIMALAYAN',
      name: 'Alpine-Himalayan Belt',
      category: 'TECTONIC_PLATE',
      coordinates: [
        [-10, 36], [15, 40], [40, 38], [70, 35], [90, 28], [100, 10], [120, -5]
      ]
    }
  ];

  // ============================================================
  // 4. Ocean Trenches (Deep subduction zones)
  // ============================================================

  static readonly OCEAN_TRENCHES: GISFeaturePolygon[] = [
    {
      id: 'MARIANA_TRENCH',
      name: 'Mariana Trench (10,994m)',
      category: 'OCEAN_TRENCH',
      coordinates: [[142.0, 11.3], [143.5, 15.0], [145.0, 20.0]]
    },
    {
      id: 'PUERTO_RICO_TRENCH',
      name: 'Puerto Rico Trench (8,376m)',
      category: 'OCEAN_TRENCH',
      coordinates: [[-68.0, 19.5], [-64.0, 20.0], [-60.0, 19.0]]
    },
    {
      id: 'JAVA_TRENCH',
      name: 'Sunda / Java Trench (7,450m)',
      category: 'OCEAN_TRENCH',
      coordinates: [[95.0, 5.0], [105.0, -6.0], [120.0, -10.0]]
    }
  ];

  // ============================================================
  // 5. Major River Basins — Reference Points
  // ============================================================

  static readonly RIVER_BASINS: GISFeaturePolygon[] = [
    {
      id: 'NILE_BASIN',
      name: 'Nile River Basin',
      category: 'RIVER_BASIN',
      coordinates: [
        [31.0, 31.0], [32.0, 25.0], [33.0, 15.0], [30.0, 2.0], [32.0, -3.0]
      ]
    },
    {
      id: 'AMAZON_BASIN',
      name: 'Amazon River Basin',
      category: 'RIVER_BASIN',
      coordinates: [
        [-50.0, -0.1], [-60.0, -3.0], [-70.0, -4.0], [-76.0, -5.0]
      ]
    },
    {
      id: 'MISSISSIPPI_BASIN',
      name: 'Mississippi River Basin',
      category: 'RIVER_BASIN',
      coordinates: [
        [-89.0, 29.0], [-91.0, 35.0], [-90.0, 42.0], [-95.0, 47.0]
      ]
    },
    {
      id: 'YANGTZE_BASIN',
      name: 'Yangtze River Basin',
      category: 'RIVER_BASIN',
      coordinates: [
        [121.0, 31.0], [112.0, 30.0], [105.0, 30.0], [91.0, 33.0]
      ]
    },
    {
      id: 'DANUBE_BASIN',
      name: 'Danube River Basin',
      category: 'RIVER_BASIN',
      coordinates: [
        [29.0, 45.0], [20.0, 44.0], [16.0, 48.0], [8.0, 48.0]
      ]
    }
  ];
}

// ============================================================
// 6. Utility Functions
// ============================================================

/**
 * Get all available feature categories
 */
export function getFeatureCategories(): string[] {
  return [
    'TECTONIC_PLATE',
    'OCEAN_TRENCH',
    'RIVER_BASIN',
    'CONTINENT',
    'ISLAND',
    'COUNTRY_BORDER',
  ];
}

/**
 * Get features by category
 */
export function getFeaturesByCategory(category: string): GISFeaturePolygon[] {
  const allFeatures: GISFeaturePolygon[] = [
    ...NaturalEarthDatasets.CONTINENTS,
    ...NaturalEarthDatasets.TECTONIC_PLATES,
    ...NaturalEarthDatasets.OCEAN_TRENCHES,
    ...NaturalEarthDatasets.RIVER_BASINS,
  ];
  return allFeatures.filter(f => f.category === category);
}