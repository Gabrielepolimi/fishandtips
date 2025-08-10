export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string; // hashed
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  preferences: UserPreferences;
  interests: FishingInterests;
  location?: UserLocation;
  experience: ExperienceLevel;
  notifications: NotificationSettings;
}

export interface UserPreferences {
  newsletterFrequency: 'weekly' | 'biweekly' | 'monthly';
  preferredContent: 'techniques' | 'gear' | 'spots' | 'all';
  language: 'it' | 'en';
  timezone?: string;
}

export interface FishingInterests {
  techniques: FishingTechnique[];
  targetSpecies: string[];
  environments: FishingEnvironment[];
  gearTypes: GearType[];
  seasons: Season[];
}

export interface UserLocation {
  region?: string;
  province?: string;
  city?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  weeklyDigest: boolean;
  newArticles: boolean;
  seasonalTips: boolean;
  gearDeals: boolean;
}

// Enums for better type safety
export enum FishingTechnique {
  SPINNING = 'spinning',
  FLY_FISHING = 'fly_fishing',
  CARP_FISHING = 'carp_fishing',
  BASS_FISHING = 'bass_fishing',
  PIKE_FISHING = 'pike_fishing',
  TROUT_FISHING = 'trout_fishing',
  SEA_FISHING = 'sea_fishing',
  LAKE_FISHING = 'lake_fishing',
  RIVER_FISHING = 'river_fishing',
  ICE_FISHING = 'ice_fishing',
  SURF_FISHING = 'surf_fishing',
  BOAT_FISHING = 'boat_fishing'
}

export enum FishingEnvironment {
  RIVERS = 'rivers',
  LAKES = 'lakes',
  SEA = 'sea',
  PONDS = 'ponds',
  STREAMS = 'streams',
  RESERVOIRS = 'reservoirs',
  COASTAL = 'coastal',
  DEEP_SEA = 'deep_sea'
}

export enum GearType {
  RODS = 'rods',
  REELS = 'reels',
  LURES = 'lures',
  BAITS = 'baits',
  LINES = 'lines',
  HOOKS = 'hooks',
  SINKERS = 'sinkers',
  FLOATS = 'floats',
  NETS = 'nets',
  WADERS = 'waders',
  BOOTS = 'boots',
  CLOTHING = 'clothing',
  ACCESSORIES = 'accessories'
}

export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  AUTUMN = 'autumn',
  WINTER = 'winter'
}

// Registration form data
export interface RegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  experience: ExperienceLevel;
  interests: Partial<FishingInterests>;
  location?: Partial<UserLocation>;
  preferences: Partial<UserPreferences>;
  notifications: Partial<NotificationSettings>;
}

// Login data
export interface LoginData {
  email: string;
  password: string;
}

// User profile update data
export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  interests?: Partial<FishingInterests>;
  location?: Partial<UserLocation>;
  preferences?: Partial<UserPreferences>;
  notifications?: Partial<NotificationSettings>;
}

// Password change data
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
