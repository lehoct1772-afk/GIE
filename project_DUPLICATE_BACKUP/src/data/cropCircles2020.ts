export interface CropCircleSite {
  name: string;
  lat: number;
  lng: number;
  date: string;
  precision: "site" | "locality";
}

// 2020 archive locations. Coordinates are locality-level unless a well-known site
// coordinate is unambiguous; the UI should not present locality coordinates as survey points.
export const CROP_CIRCLES_2020: CropCircleSite[] = [
  { name: "Roundway, Wiltshire", lat: 51.353, lng: -1.984, date: "2020-09-13", precision: "locality" },
  { name: "Marden Copse, Wiltshire", lat: 51.319, lng: -1.872, date: "2020-09-07", precision: "locality" },
  { name: "Chirton, Wiltshire", lat: 51.313, lng: -1.893, date: "2020-09-05", precision: "locality" },
  { name: "Uffington Castle, Oxfordshire", lat: 51.5776, lng: -1.5667, date: "2020-08-09", precision: "site" },
  { name: "Patney Bridge, Wiltshire", lat: 51.318, lng: -1.884, date: "2020-08-08", precision: "locality" },
  { name: "Scratchbury Hillfort, Wiltshire", lat: 51.187, lng: -2.146, date: "2020-08-07", precision: "site" },
  { name: "Potterne (2), Wiltshire", lat: 51.329, lng: -2.006, date: "2020-08-04", precision: "locality" },
  { name: "Yarnbury Castle, Wiltshire", lat: 51.185, lng: -1.998, date: "2020-07-26", precision: "site" },
  { name: "Etchilhampton (2), Wiltshire", lat: 51.313, lng: -1.958, date: "2020-07-26", precision: "locality" },
  { name: "Hackpen Hill, Wiltshire", lat: 51.477, lng: -1.839, date: "2020-07-23", precision: "site" },
  { name: "Bishops Sutton, Hampshire", lat: 51.083, lng: -1.133, date: "2020-07-22", precision: "locality" },
  { name: "Danebury Ring, Hampshire", lat: 51.136, lng: -1.537, date: "2020-07", precision: "site" },
  { name: "Etchilhampton, Wiltshire", lat: 51.313, lng: -1.958, date: "2020-07-17", precision: "locality" },
  { name: "Stonehenge, Wiltshire", lat: 51.1789, lng: -1.8262, date: "2020-07-16", precision: "site" },
  { name: "Eastern Royal, Wiltshire", lat: 51.342, lng: -1.801, date: "2020-07-10", precision: "locality" },
  { name: "Stanton St. Bernard, Wiltshire", lat: 51.353, lng: -1.861, date: "2020-07-07", precision: "locality" },
  { name: "Longwood Warren, Hampshire", lat: 51.092, lng: -1.304, date: "2020-06-29", precision: "locality" },
  { name: "Ogbourne St. George, Wiltshire", lat: 51.468, lng: -1.666, date: "2020-06-25", precision: "locality" },
  { name: "Berwick Bassett, Wiltshire", lat: 51.459, lng: -1.854, date: "2020-06-21", precision: "locality" },
  { name: "Wilton, Wiltshire", lat: 51.080, lng: -1.863, date: "2020-06-17", precision: "locality" },
  { name: "Burderop Down, Wiltshire", lat: 51.514, lng: -1.736, date: "2020-06-14", precision: "locality" },
  { name: "Dilton Marsh, Wiltshire", lat: 51.248, lng: -2.205, date: "2020-06-11", precision: "locality" },
  { name: "Sixpenny Handley, Dorset", lat: 50.952, lng: -1.989, date: "2020-05-31", precision: "locality" },
  { name: "Cley Hill, Wiltshire", lat: 51.191, lng: -2.213, date: "2020-05-30", precision: "site" },
  { name: "Potterne, Wiltshire", lat: 51.329, lng: -2.006, date: "2020-05-28", precision: "locality" },
];
