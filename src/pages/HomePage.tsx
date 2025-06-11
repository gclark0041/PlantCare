import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
} from '@mui/material';
import {
  LocalFlorist as PlantIcon,
  WaterDrop as WaterIcon,
  WbSunny as SunIcon,
  Schedule as ScheduleIcon,
  TrendingUp as GrowthIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { localStorageService } from '../services/localStorage';
import { plantApiService } from '../services/plantApi';
import { Plant, CareTask, WeatherData } from '../types';

const HomePage: React.FC = () => {
  const [userPlants, setUserPlants] = useState<Plant[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<CareTask[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load user plants
      const plants = localStorageService.getUserPlants();
      setUserPlants(plants);

      // Load upcoming tasks (next 7 days)
      const tasks = localStorageService.getCareTasks();
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const upcoming = tasks
        .filter(task => !task.isCompleted && task.scheduledDate <= weekFromNow)
        .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
        .slice(0, 5);
      
      setUpcomingTasks(upcoming);

      // Load weather data (using default location for demo)
      try {
        const weatherData = await plantApiService.getWeatherData('New York');
        setWeather(weatherData);
      } catch (error) {
        console.error('Failed to load weather data:', error);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'watering':
        return <WaterIcon color="primary" />;
      case 'fertilizing':
        return <GrowthIcon color="secondary" />;
      default:
        return <ScheduleIcon />;
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getOverdueTasks = () => {
    return upcomingTasks.filter(task => task.isOverdue);
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Welcome to PlantCare
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Nurture your green companions with care
        </Typography>
      </Box>

      {/* Overdue tasks alert */}
      {getOverdueTasks().length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You have {getOverdueTasks().length} overdue task{getOverdueTasks().length > 1 ? 's' : ''}!
        </Alert>
      )}

      {/* Weather Card */}
      {weather && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SunIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">Today's Weather</Typography>
            </Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {weather.temperature}°C
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {weather.description} • {weather.humidity}% humidity
            </Typography>
            {weather.recommendations && weather.recommendations.length > 0 && (
              <Box>
                {weather.recommendations.map((rec, index) => (
                  <Chip
                    key={index}
                    label={rec}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Plant Collection Overview */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Your Garden</Typography>
            <Chip
              label={`${userPlants.length} plants`}
              color="primary"
              icon={<PlantIcon />}
            />
          </Box>
          
          {userPlants.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No plants in your garden yet. Start by searching for plants and adding them to your collection!
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {userPlants.slice(0, 6).map((plant) => (
                <Grid key={plant.id} size={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={plant.imageUrl}
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        mx: 'auto', 
                        mb: 1,
                        bgcolor: 'primary.light',
                      }}
                    >
                      <PlantIcon />
                    </Avatar>
                    <Typography variant="caption" display="block" noWrap>
                      {plant.name}
                    </Typography>
                  </Box>
                </Grid>
              ))}
              {userPlants.length > 6 && (
                <Grid size={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        mx: 'auto', 
                        mb: 1,
                        bgcolor: 'grey.300',
                      }}
                    >
                      +{userPlants.length - 6}
                    </Avatar>
                    <Typography variant="caption" display="block">
                      More plants
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Upcoming Care</Typography>
            <Chip
              label={`${upcomingTasks.length} tasks`}
              color={getOverdueTasks().length > 0 ? 'error' : 'primary'}
              icon={<ScheduleIcon />}
            />
          </Box>

          {upcomingTasks.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No upcoming tasks. Your plants are all caught up!
            </Typography>
          ) : (
            <List dense>
              {upcomingTasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  <ListItem
                    sx={{
                      px: 0,
                      bgcolor: task.isOverdue ? 'error.50' : 'transparent',
                      borderRadius: 1,
                    }}
                  >
                    <ListItemIcon>
                      {task.isOverdue ? (
                        <WarningIcon color="error" />
                      ) : (
                        getTaskIcon(task.taskType)
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={`${task.taskType} ${task.plantName}`}
                      secondary={formatDate(task.scheduledDate)}
                      primaryTypographyProps={{
                        color: task.isOverdue ? 'error.main' : 'text.primary',
                      }}
                    />
                  </ListItem>
                  {index < upcomingTasks.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default HomePage; 