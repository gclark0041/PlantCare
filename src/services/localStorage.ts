import { Plant, CareTask, UserPreferences } from '../types';

class LocalStorageService {
  private readonly PLANTS_KEY = 'plant_care_user_plants';
  private readonly TASKS_KEY = 'plant_care_care_tasks';
  private readonly PREFERENCES_KEY = 'plant_care_user_preferences';

  // Plant management
  getUserPlants(): Plant[] {
    try {
      const plants = localStorage.getItem(this.PLANTS_KEY);
      return plants ? JSON.parse(plants) : [];
    } catch (error) {
      console.error('Error loading user plants:', error);
      return [];
    }
  }

  saveUserPlant(plant: Plant): void {
    try {
      const plants = this.getUserPlants();
      const existingIndex = plants.findIndex(p => p.id === plant.id);
      
      if (existingIndex >= 0) {
        plants[existingIndex] = plant;
      } else {
        plants.push({ ...plant, isUserPlant: true });
      }
      
      localStorage.setItem(this.PLANTS_KEY, JSON.stringify(plants));
    } catch (error) {
      console.error('Error saving plant:', error);
    }
  }

  deleteUserPlant(plantId: string): void {
    try {
      const plants = this.getUserPlants();
      const filteredPlants = plants.filter(p => p.id !== plantId);
      localStorage.setItem(this.PLANTS_KEY, JSON.stringify(filteredPlants));
      
      // Also remove related tasks
      this.deleteTasksForPlant(plantId);
    } catch (error) {
      console.error('Error deleting plant:', error);
    }
  }

  updatePlantCareDate(plantId: string, careType: 'watered' | 'fertilized' | 'repotted'): void {
    try {
      const plants = this.getUserPlants();
      const plantIndex = plants.findIndex(p => p.id === plantId);
      
      if (plantIndex >= 0) {
        const now = new Date();
        switch (careType) {
          case 'watered':
            plants[plantIndex].lastWatered = now;
            break;
          case 'fertilized':
            plants[plantIndex].lastFertilized = now;
            break;
          case 'repotted':
            plants[plantIndex].lastRepotted = now;
            break;
        }
        localStorage.setItem(this.PLANTS_KEY, JSON.stringify(plants));
      }
    } catch (error) {
      console.error('Error updating care date:', error);
    }
  }

  // Care tasks management
  getCareTasks(): CareTask[] {
    try {
      const tasks = localStorage.getItem(this.TASKS_KEY);
      const parsedTasks = tasks ? JSON.parse(tasks) : [];
      
      // Convert string dates back to Date objects and check for overdue
      return parsedTasks.map((task: any) => ({
        ...task,
        scheduledDate: new Date(task.scheduledDate),
        completedDate: task.completedDate ? new Date(task.completedDate) : undefined,
        isOverdue: !task.isCompleted && new Date(task.scheduledDate) < new Date(),
      }));
    } catch (error) {
      console.error('Error loading care tasks:', error);
      return [];
    }
  }

  saveTask(task: CareTask): void {
    try {
      const tasks = this.getCareTasks();
      const existingIndex = tasks.findIndex(t => t.id === task.id);
      
      if (existingIndex >= 0) {
        tasks[existingIndex] = task;
      } else {
        tasks.push(task);
      }
      
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving task:', error);
    }
  }

  completeTask(taskId: string, notes?: string): void {
    try {
      const tasks = this.getCareTasks();
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex >= 0) {
        tasks[taskIndex].isCompleted = true;
        tasks[taskIndex].completedDate = new Date();
        if (notes) {
          tasks[taskIndex].notes = notes;
        }
        
        localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
        
        // Update plant care date
        const task = tasks[taskIndex];
        if (task.taskType === 'watering') {
          this.updatePlantCareDate(task.plantId, 'watered');
        } else if (task.taskType === 'fertilizing') {
          this.updatePlantCareDate(task.plantId, 'fertilized');
        } else if (task.taskType === 'repotting') {
          this.updatePlantCareDate(task.plantId, 'repotted');
        }
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  }

  deleteTask(taskId: string): void {
    try {
      const tasks = this.getCareTasks();
      const filteredTasks = tasks.filter(t => t.id !== taskId);
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(filteredTasks));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  deleteTasksForPlant(plantId: string): void {
    try {
      const tasks = this.getCareTasks();
      const filteredTasks = tasks.filter(t => t.plantId !== plantId);
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(filteredTasks));
    } catch (error) {
      console.error('Error deleting tasks for plant:', error);
    }
  }

  // Generate care tasks based on plant care instructions
  generateCareTasks(plant: Plant): void {
    if (!plant.careInstructions) return;

    const tasks: CareTask[] = [];
    const now = new Date();

    // Generate watering task
    if (plant.careInstructions.watering) {
      const wateringInterval = this.parseFrequency(plant.careInstructions.watering.frequency);
      const nextWatering = new Date(now);
      nextWatering.setDate(now.getDate() + wateringInterval);

      tasks.push({
        id: `${plant.id}-watering-${Date.now()}`,
        plantId: plant.id,
        plantName: plant.name,
        taskType: 'watering',
        scheduledDate: nextWatering,
        isCompleted: false,
        isOverdue: false,
      });
    }

    // Generate fertilizing task
    if (plant.careInstructions.fertilizing) {
      const fertilizingInterval = this.parseFrequency(plant.careInstructions.fertilizing.frequency);
      const nextFertilizing = new Date(now);
      nextFertilizing.setDate(now.getDate() + fertilizingInterval);

      tasks.push({
        id: `${plant.id}-fertilizing-${Date.now()}`,
        plantId: plant.id,
        plantName: plant.name,
        taskType: 'fertilizing',
        scheduledDate: nextFertilizing,
        isCompleted: false,
        isOverdue: false,
      });
    }

    // Save all generated tasks
    tasks.forEach(task => this.saveTask(task));
  }

  private parseFrequency(frequency: string): number {
    // Parse frequency strings like "weekly", "bi-weekly", "monthly", etc.
    const normalizedFreq = frequency.toLowerCase();
    
    if (normalizedFreq.includes('daily')) return 1;
    if (normalizedFreq.includes('weekly') && normalizedFreq.includes('bi')) return 14;
    if (normalizedFreq.includes('weekly')) return 7;
    if (normalizedFreq.includes('monthly')) return 30;
    if (normalizedFreq.includes('yearly')) return 365;
    
    // Try to extract number from frequency
    const match = frequency.match(/(\d+)/);
    return match ? parseInt(match[1]) : 7; // Default to weekly
  }

  // User preferences
  getUserPreferences(): UserPreferences {
    try {
      const preferences = localStorage.getItem(this.PREFERENCES_KEY);
      return preferences ? JSON.parse(preferences) : this.getDefaultPreferences();
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  saveUserPreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'light',
      notifications: {
        careReminders: true,
        plantTips: true,
        wateringAlerts: true,
      },
      units: {
        temperature: 'C',
        measurement: 'metric',
      },
    };
  }
}

export const localStorageService = new LocalStorageService(); 