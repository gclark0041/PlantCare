export interface Plant {
  id: string;
  name: string;
  scientificName?: string;
  commonNames?: string[];
  description?: string;
  imageUrl?: string;
  careInstructions?: CareInstructions;
  plantedDate?: Date;
  location?: string;
  isUserPlant?: boolean;
  notes?: string;
  lastWatered?: Date;
  lastFertilized?: Date;
  lastRepotted?: Date;
}

export interface CareInstructions {
  watering: {
    frequency: string;
    amount: string;
    notes?: string;
  };
  sunlight: {
    type: 'full sun' | 'partial sun' | 'partial shade' | 'full shade';
    hours: string;
  };
  fertilizing: {
    frequency: string;
    type: string;
    season?: string;
  };
  temperature: {
    min: number;
    max: number;
    unit: 'C' | 'F';
  };
  humidity?: string;
  soilType?: string;
  repotting?: string;
  pruning?: string;
}

export interface CareTask {
  id: string;
  plantId: string;
  plantName: string;
  taskType: 'watering' | 'fertilizing' | 'repotting' | 'pruning' | 'inspection';
  scheduledDate: Date;
  completedDate?: Date;
  notes?: string;
  isCompleted: boolean;
  isOverdue: boolean;
}

export interface PlantSearchResult {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name?: string[];
  cycle: string;
  watering: string;
  sunlight: string[];
  default_image?: {
    small_url: string;
    medium_url: string;
    regular_url: string;
  };
}

export interface PlantDetails extends PlantSearchResult {
  family?: string;
  origin?: string[];
  dimension?: string;
  type?: string;
  hardiness?: {
    min: string;
    max: string;
  };
  care_level?: string;
  growth_rate?: string;
  maintenance?: string;
  care_guides?: string;
  problem_solving?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    careReminders: boolean;
    plantTips: boolean;
    wateringAlerts: boolean;
  };
  units: {
    temperature: 'C' | 'F';
    measurement: 'metric' | 'imperial';
  };
  location?: {
    city: string;
    country: string;
    timezone: string;
  };
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  icon: string;
  uvIndex?: number;
  recommendations?: string[];
} 