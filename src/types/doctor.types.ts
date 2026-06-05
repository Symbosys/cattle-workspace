import { State, City } from "./animal.types";

export interface DoctorProfile {
  id: string;
  userId: string;
  licenseNumber: string | null;
  specialization: string;
  experienceYears: number;
  qualificationDocUrl: any;
  isVerified: boolean;
  verificationStatus: string;
  listingStatus: string;
  consultationFee: string | number;
  createdAt: string;
  updatedAt: string;
  doctorLocations: DoctorLocation[];
  
  // Optional included fields
  user?: {
    id: string;
    name: string;
    phone: string;
    avatarUrl?: string | null;
    email?: string | null;
  };
  distance?: number;
}

export interface GetDoctorsByLocationResponse {
  doctors: DoctorProfile[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    count: number;
  };
}


export interface DoctorLocation {
  id: string;
  doctorId: string;
  latitude: string;
  longitude: string;
  stateId: string;
  cityId: string;
  state: State;
  city: City;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterDoctorRequest {
  licenseNumber?: string | null;
  specialization: string;
  experienceYears: number;
  consultationFee: number;
  latitude: number;
  longitude: number;
  stateName: string;
  stateCode?: string | null;
  stateLatitude?: number | null;
  stateLongitude?: number | null;
  cityName: string;
  cityLatitude?: number | null;
  cityLongitude?: number | null;
  
  // Qualification document file
  qualificationDoc?: File;
}

export interface UpdateDoctorRequest {
  licenseNumber?: string | null;
  specialization?: string;
  experienceYears?: number;
  consultationFee?: number;
  latitude?: number;
  longitude?: number;
  stateName?: string;
  stateCode?: string | null;
  stateLatitude?: number | null;
  stateLongitude?: number | null;
  cityName?: string;
  cityLatitude?: number | null;
  cityLongitude?: number | null;
  qualificationDoc?: File;
}

export interface DoctorReview {
  id: string;
  doctorId: string;
  appointmentId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  appointment?: {
    patient: {
      id: string;
      name: string;
      avatarUrl: string | null;
    };
  };
}

export interface CreateDoctorReviewRequest {
  appointmentId: string;
  rating: number;
  comment?: string;
}

export interface GetDoctorReviewsResponse {
  reviews: DoctorReview[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    count: number;
  };
}

