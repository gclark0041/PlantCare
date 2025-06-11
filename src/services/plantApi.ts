import axios from 'axios';
import { PlantSearchResult, PlantDetails, WeatherData } from '../types';

// Using Perenual API (free tier) for plant information
const PERENUAL_API_KEY = process.env.REACT_APP_PERENUAL_API_KEY || 'sk-PNjL67d5e53902a518589';
const PERENUAL_BASE_URL = 'https://perenual.com/api';

// OpenWeatherMap API for weather-based care recommendations
const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'demo_key';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Enhanced search filters using Perenual API capabilities
export interface PlantSearchFilters {
  query?: string;
  page?: number;
  edible?: boolean;
  poisonous?: boolean;
  cycle?: 'perennial' | 'annual' | 'biennial' | 'biannual';
  watering?: 'frequent' | 'average' | 'minimum' | 'none';
  sunlight?: 'full_shade' | 'part_shade' | 'sun-part_shade' | 'full_sun';
  indoor?: boolean;
  hardiness?: number; // 1-13
  order?: 'asc' | 'desc';
}

export interface HardinessZone {
  zone: number;
  description: string;
  temperatureRange: string;
  suitable: boolean;
}

class PlantApiService {
  private perenualApi = axios.create({
    baseURL: PERENUAL_BASE_URL,
    params: {
      key: PERENUAL_API_KEY,
    },
  });

  private weatherApi = axios.create({
    baseURL: WEATHER_BASE_URL,
    params: {
      appid: WEATHER_API_KEY,
      units: 'metric',
    },
  });

  // Enhanced search with full Perenual API filtering capabilities
  async searchPlants(filters: PlantSearchFilters = {}): Promise<PlantSearchResult[]> {
    try {
      const params: any = {};
      
      // Build dynamic params based on filters
      if (filters.query) params.q = filters.query;
      if (filters.page) params.page = filters.page;
      if (filters.edible !== undefined) params.edible = filters.edible ? 1 : 0;
      if (filters.poisonous !== undefined) params.poisonous = filters.poisonous ? 1 : 0;
      if (filters.cycle) params.cycle = filters.cycle;
      if (filters.watering) params.watering = filters.watering;
      if (filters.sunlight) params.sunlight = filters.sunlight;
      if (filters.indoor !== undefined) params.indoor = filters.indoor ? 1 : 0;
      if (filters.hardiness) params.hardiness = filters.hardiness;
      if (filters.order) params.order = filters.order;

      const response = await this.perenualApi.get('/species-list', { params });

      // Check if response has data
      if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
        console.warn('Invalid API response structure:', response.data);
        return this.getMockPlants(filters.query || '');
      }

      return response.data.data.map((plant: any) => ({
        id: plant.id,
        common_name: plant.common_name,
        scientific_name: plant.scientific_name,
        other_name: plant.other_name,
        cycle: plant.cycle,
        watering: plant.watering,
        sunlight: plant.sunlight,
        default_image: plant.default_image,
        // Enhanced fields from API
        family: plant.family,
        edible_leaf: plant.edible_leaf,
        poisonous_to_humans: plant.poisonous_to_humans,
        poisonous_to_pets: plant.poisonous_to_pets,
        indoor: plant.indoor,
        care_level: plant.care_level,
      }));
    } catch (error) {
      console.error('Error searching plants:', error);
      // Return mock data if API fails
      return this.getMockPlants(filters.query || '');
    }
  }

  // New method: Get hardiness zone information for a plant
  // Note: This endpoint may not be available in the free tier
  async getPlantHardinessZone(speciesId: number): Promise<HardinessZone | null> {
    try {
      const response = await axios.get(`${PERENUAL_BASE_URL}/hardiness-map`, {
        params: { 
          species_id: speciesId,
          key: PERENUAL_API_KEY
        }
      });
      
      return {
        zone: response.data.hardiness_zone,
        description: response.data.description,
        temperatureRange: response.data.temperature_range,
        suitable: response.data.suitable_for_location,
      };
    } catch (error) {
      console.warn('Hardiness zone endpoint not available or failed:', error);
      return null;
    }
  }

  // Enhanced search methods for specific use cases
  async searchIndoorPlants(query?: string, page: number = 1): Promise<PlantSearchResult[]> {
    return this.searchPlants({
      query,
      page,
      indoor: true,
      order: 'asc'
    });
  }

  async searchEdiblePlants(query?: string, page: number = 1): Promise<PlantSearchResult[]> {
    return this.searchPlants({
      query,
      page,
      edible: true,
      poisonous: false, // Safety first!
      order: 'asc'
    });
  }

  async searchLowMaintenancePlants(query?: string, page: number = 1): Promise<PlantSearchResult[]> {
    return this.searchPlants({
      query,
      page,
      watering: 'minimum',
      sunlight: 'part_shade',
      order: 'asc'
    });
  }

  async searchByClimateZone(zone: number, query?: string, page: number = 1): Promise<PlantSearchResult[]> {
    return this.searchPlants({
      query,
      page,
      hardiness: zone,
      order: 'asc'
    });
  }

  // Original methods with enhancements
  async getPlantDetails(plantId: number): Promise<PlantDetails | null> {
    try {
      const response = await this.perenualApi.get(`/species/details/${plantId}`);
      const plant = response.data;

      // Also get hardiness info
      const hardinessInfo = await this.getPlantHardinessZone(plantId);

      return {
        id: plant.id,
        common_name: plant.common_name,
        scientific_name: plant.scientific_name,
        other_name: plant.other_name,
        cycle: plant.cycle,
        watering: plant.watering,
        sunlight: plant.sunlight,
        default_image: plant.default_image,
        family: plant.family,
        origin: plant.origin,
        dimension: plant.dimension,
        type: plant.type,
        hardiness: plant.hardiness,
        hardiness_zone: hardinessInfo, // Enhanced with zone info
        care_level: plant.care_level,
        growth_rate: plant.growth_rate,
        maintenance: plant.maintenance,
        care_guides: plant.care_guides,
        problem_solving: plant.problem_solving,
        // Safety information
        poisonous_to_humans: plant.poisonous_to_humans,
        poisonous_to_pets: plant.poisonous_to_pets,
        edible_leaf: plant.edible_leaf,
        indoor: plant.indoor,
        drought_tolerant: plant.drought_tolerant,
        salt_tolerant: plant.salt_tolerant,
        flowers: plant.flowers,
        flowering_season: plant.flowering_season,
        medicinal: plant.medicinal,
      };
    } catch (error) {
      console.error('Error fetching plant details:', error);
      return this.getMockPlantDetails(plantId);
    }
  }

  async getCareGuide(plantId: number): Promise<any> {
    try {
      const response = await this.perenualApi.get(`/species-care-guide-list`, {
        params: {
          species_id: plantId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching care guide:', error);
      return null;
    }
  }

  async getWeatherData(city: string): Promise<WeatherData | null> {
    try {
      const response = await this.weatherApi.get('/weather', {
        params: {
          q: city,
        },
      });

      const data = response.data;
      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        uvIndex: data.uvi,
        recommendations: this.generateWeatherRecommendations(data),
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return this.getMockWeatherData();
    }
  }

  private generateWeatherRecommendations(weatherData: any): string[] {
    const recommendations: string[] = [];
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;

    if (temp > 30) {
      recommendations.push('High temperature - ensure adequate watering and shade for sensitive plants');
    } else if (temp < 10) {
      recommendations.push('Low temperature - bring sensitive plants indoors');
    }

    if (humidity < 30) {
      recommendations.push('Low humidity - consider misting your plants or using a humidifier');
    } else if (humidity > 80) {
      recommendations.push('High humidity - ensure good air circulation to prevent fungal issues');
    }

    return recommendations;
  }

  private getMockPlants(query: string): PlantSearchResult[] {
    const mockPlants = [
      {
        id: 1,
        common_name: 'Snake Plant',
        scientific_name: ['Sansevieria trifasciata'],
        other_name: ['Mother-in-law\'s tongue'],
        cycle: 'Perennial',
        watering: 'Minimum',
        sunlight: ['part shade'],
        default_image: {
          small_url: '/api/placeholder/150/150',
          medium_url: '/api/placeholder/300/300',
          regular_url: '/api/placeholder/600/600',
        },
      },
      {
        id: 2,
        common_name: 'Pothos',
        scientific_name: ['Epipremnum aureum'],
        other_name: ['Golden Pothos', 'Devil\'s Ivy'],
        cycle: 'Perennial',
        watering: 'Average',
        sunlight: ['part shade'],
        default_image: {
          small_url: '/api/placeholder/150/150',
          medium_url: '/api/placeholder/300/300',
          regular_url: '/api/placeholder/600/600',
        },
      },
      {
        id: 3,
        common_name: 'Spider Plant',
        scientific_name: ['Chlorophytum comosum'],
        other_name: ['Airplane Plant'],
        cycle: 'Perennial',
        watering: 'Average',
        sunlight: ['part sun/part shade'],
        default_image: {
          small_url: '/api/placeholder/150/150',
          medium_url: '/api/placeholder/300/300',
          regular_url: '/api/placeholder/600/600',
        },
      },
    ];

    return mockPlants.filter(plant => 
      plant.common_name.toLowerCase().includes(query.toLowerCase()) ||
      plant.scientific_name[0].toLowerCase().includes(query.toLowerCase())
    );
  }

  private getMockPlantDetails(plantId: number): PlantDetails | null {
    const mockDetails: { [key: number]: PlantDetails } = {
      1: {
        id: 1,
        common_name: 'Snake Plant',
        scientific_name: ['Sansevieria trifasciata'],
        other_name: ['Mother-in-law\'s tongue'],
        cycle: 'Perennial',
        watering: 'Minimum',
        sunlight: ['part shade'],
        default_image: {
          small_url: '/api/placeholder/150/150',
          medium_url: '/api/placeholder/300/300',
          regular_url: '/api/placeholder/600/600',
        },
        family: 'Asparagaceae',
        origin: ['West Africa'],
        care_level: 'Low',
        growth_rate: 'Slow',
        maintenance: 'Low',
        care_guides: 'Water sparingly, allow soil to dry between waterings. Tolerates low light.',
      },
    };

    return mockDetails[plantId] || null;
  }

  private getMockWeatherData(): WeatherData {
    return {
      temperature: 22,
      humidity: 65,
      description: 'partly cloudy',
      icon: '02d',
      recommendations: ['Perfect weather for most houseplants'],
    };
  }
}

export const plantApiService = new PlantApiService(); 