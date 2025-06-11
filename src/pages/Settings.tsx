import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Switch,
  TextField,
  Button,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { localStorageService } from '../services/localStorage';
import { UserPreferences } from '../types';

const Settings: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(
    localStorageService.getUserPreferences()
  );

  const handleSave = () => {
    localStorageService.saveUserPreferences(preferences);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customize your PlantCare experience
        </Typography>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <NotificationsIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Notifications</Typography>
          </Box>
          
          <List>
            <ListItem>
              <ListItemText primary="Care Reminders" secondary="Get notified when plants need care" />
              <Switch
                checked={preferences.notifications.careReminders}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, careReminders: e.target.checked }
                }))}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Plant Tips" secondary="Receive helpful plant care tips" />
              <Switch
                checked={preferences.notifications.plantTips}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, plantTips: e.target.checked }
                }))}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Watering Alerts" secondary="Urgent watering notifications" />
              <Switch
                checked={preferences.notifications.wateringAlerts}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, wateringAlerts: e.target.checked }
                }))}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Location</Typography>
          </Box>
          
          <TextField
            fullWidth
            label="City"
            value={preferences.location?.city || ''}
            onChange={(e) => setPreferences(prev => ({
              ...prev,
              location: { ...prev.location!, city: e.target.value }
            }))}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Country"
            value={preferences.location?.country || ''}
            onChange={(e) => setPreferences(prev => ({
              ...prev,
              location: { ...prev.location!, country: e.target.value }
            }))}
          />
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <InfoIcon sx={{ mr: 1 }} />
            <Typography variant="h6">About</Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            PlantCare PWA v1.0.0
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            A comprehensive plant care application to help you nurture your green companions.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Built with React, Material-UI, and love for plants 🌱
          </Typography>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleSave}
      >
        Save Settings
      </Button>
    </Container>
  );
};

export default Settings; 