import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Components
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import MyFlowerBed from './pages/MyFlowerBed';
import PlantSearch from './pages/PlantSearch';
import PlantDetails from './pages/PlantDetails';
import CareSchedule from './pages/CareSchedule';
import Settings from './pages/Settings';

// PWA Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
      light: '#60AD5E',
      dark: '#005005',
    },
    secondary: {
      main: '#81C784',
      light: '#B2DFB7',
      dark: '#519657',
    },
    background: {
      default: '#F1F8F1',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation />
          <Box component="main" sx={{ flexGrow: 1, pb: 7 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/my-flower-bed" element={<MyFlowerBed />} />
              <Route path="/plant-search" element={<PlantSearch />} />
              <Route path="/plant/:id" element={<PlantDetails />} />
              <Route path="/care-schedule" element={<CareSchedule />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
