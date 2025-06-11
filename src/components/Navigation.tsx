import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
} from '@mui/material';
import {
  Home as HomeIcon,
  LocalFlorist as FlowerIcon,
  Search as SearchIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { localStorageService } from '../services/localStorage';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get pending tasks count for badge
  const pendingTasks = localStorageService.getCareTasks()
    .filter(task => !task.isCompleted).length;

  const handleNavigation = (event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const getCurrentValue = () => {
    const path = location.pathname;
    if (path === '/') return '/';
    if (path === '/my-flower-bed') return '/my-flower-bed';
    if (path === '/plant-search') return '/plant-search';
    if (path === '/care-schedule') return '/care-schedule';
    if (path === '/settings') return '/settings';
    return '/';
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        borderTop: 1,
        borderColor: 'divider',
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={getCurrentValue()}
        onChange={handleNavigation}
        showLabels
        sx={{
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
            '&.Mui-selected': {
              color: 'primary.main',
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          value="/"
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          label="My Garden"
          value="/my-flower-bed"
          icon={<FlowerIcon />}
        />
        <BottomNavigationAction
          label="Search"
          value="/plant-search"
          icon={<SearchIcon />}
        />
        <BottomNavigationAction
          label="Schedule"
          value="/care-schedule"
          icon={
            <Badge badgeContent={pendingTasks} color="error" max={9}>
              <ScheduleIcon />
            </Badge>
          }
        />
        <BottomNavigationAction
          label="Settings"
          value="/settings"
          icon={<SettingsIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Navigation; 