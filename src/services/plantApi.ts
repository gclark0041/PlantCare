import axios from 'axios';
import { PlantSearchResult, PlantDetails, WeatherData } from '../types';

// Using Perenual API (free tier) for plant information
const PERENUAL_API_KEY = process.env.REACT_APP_PERENUAL_API_KEY || 'sk-Ej5867b4a5a4fa0b67690';
const PERENUAL_BASE_URL = 'https://perenual.com/api';

// OpenWeatherMap API for weather-based care recommendations
const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'demo_key';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

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

  async searchPlants(query: string, page: number = 1): Promise<PlantSearchResult[]> {
    try {
      const response = await this.perenualApi.get('/species-list', {
        params: {
          q: query,
          page,
          indoor: 1, // Focus on plants suitable for indoor growing
        },
      });

      return response.data.data.map((plant: any) => ({
        id: plant.id,
        common_name: plant.common_name,
        scientific_name: plant.scientific_name,
        other_name: plant.other_name,
        cycle: plant.cycle,
        watering: plant.watering,
        sunlight: plant.sunlight,
        default_image: plant.default_image,
      }));
    } catch (error) {
      console.error('Error searching plants:', error);
      // Return mock data if API fails
      return this.getMockPlants(query);
    }
  }

  async getPlantDetails(plantId: number): Promise<PlantDetails | null> {
    try {
      const response = await this.perenualApi.get(`/species/details/${plantId}`);
      const plant = response.data;

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
        care_level: plant.care_level,
        growth_rate: plant.growth_rate,
        maintenance: plant.maintenance,
        care_guides: plant.care_guides,
        problem_solving: plant.problem_solving,
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