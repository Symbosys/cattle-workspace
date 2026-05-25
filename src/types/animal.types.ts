export interface CreateAnimalListingRequest {
  // Animal details
  mainCategoryId: string;
  subCategoryId: string;
  name?: string | null;
  category: string;
  breed?: string | null;
  ageMonths?: number | null;
  gender?: string | null;
  weightKg?: number | null;
  description?: string | null;
  doesGiveMilk: boolean;
  dailyMilkProdLtr?: number | null;

  // Listing details
  title: string;
  price: number;
  listingDescription: string;
  latitude?: number | null;
  longitude?: number | null;

  // Location details
  stateName: string;
  stateCode?: string | null;
  stateLatitude?: number | null;
  stateLongitude?: number | null;
  cityName: string;
  cityLatitude?: number | null;
  cityLongitude?: number | null;
  areaName?: string | null;
  areaLatitude?: number | null;
  areaLongitude?: number | null;

  // Uploaded files
  images?: File[];
}

export interface Animal {
  id: string;
  ownerId: string;
  mainCategoryId: string;
  subCategoryId: string;
  name: string | null;
  category: string;
  breed: string | null;
  ageMonths: number | null;
  gender: string | null;
  weightKg: number | null;
  description: string | null;
  doesGiveMilk: boolean;
  dailyMilkProdLtr: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListingImage {
  id: string;
  listingId: string;
  url: {
    public_id: string;
    secure_url: string;
  };
  sortOrder: number;
  createdAt: string;
}

export interface State {
  id: string;
  name: string;
  stateCode: string;
  country: string;
  countryCode: string;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  isHiring: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  stateCode: string;
  stateId: string;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  isHiring: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Area {
  id: string;
  cityId: string;
  name: string;
  latitude: number;
  longitude: number;
  serviceRadiusKm: number;
  isActive: boolean;
  isHiring: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ListingLocation {
  id: string;
  listingId: string;
  stateId: string;
  cityId: string;
  areaId: string | null;
  createdAt: string;
  updatedAt: string;
  state: State;
  city: City;
  area: Area | null;
}

export interface CattleListing {
  id: string;
  ownerId: string;
  animalId: string;
  title: string;
  description: string;
  price: string;
  status: string;
  latitude: string | null;
  longitude: string | null;
  listingExpiresAt: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  animal: Animal;
  location: ListingLocation;
  images: ListingImage[];
}

export interface UpdateAnimalListingRequest {
  // Animal details
  mainCategoryId?: string;
  subCategoryId?: string;
  name?: string | null;
  category?: string;
  breed?: string | null;
  ageMonths?: number | null;
  gender?: string | null;
  weightKg?: number | null;
  description?: string | null;
  doesGiveMilk?: boolean;
  dailyMilkProdLtr?: number | null;

  // Listing details
  title?: string;
  price?: number;
  listingDescription?: string;
  latitude?: number | null;
  longitude?: number | null;

  // Location details
  stateName?: string;
  stateCode?: string | null;
  stateLatitude?: number | null;
  stateLongitude?: number | null;
  cityName?: string;
  cityLatitude?: number | null;
  cityLongitude?: number | null;
  areaName?: string | null;
  areaLatitude?: number | null;
  areaLongitude?: number | null;

  // Uploaded files
  images?: File[];

  // Image IDs to keep
  keepImageIds?: string[];
}

