import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Grid,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Avatar,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  LocalFlorist as PlantIcon,
  WbSunny as SunIcon,
  WaterDrop as WaterIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { plantApiService } from '../services/plantApi';
import { localStorageService } from '../services/localStorage';
import { PlantSearchResult, Plant, CareInstructions } from '../types';

const PlantSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlantSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantSearchResult | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [plantName, setPlantName] = useState('');
  const [plantLocation, setPlantLocation] = useState('');
  const [plantNotes, setPlantNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Load popular plants on component mount
    loadPopularPlants();
  }, []);

  const loadPopularPlants = async () => {
    setLoading(true);
    try {
      const results = await plantApiService.searchPlants('popular indoor plants');
      setSearchResults(results.slice(0, 6)); // Show top 6 popular plants
    } catch (error) {
      console.error('Error loading popular plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const results = await plantApiService.searchPlants(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching plants:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const openAddDialog = (plant: PlantSearchResult) => {
    setSelectedPlant(plant);
    setPlantName(plant.common_name);
    setPlantLocation('');
    setPlantNotes('');
    setShowAddDialog(true);
  };

  const handleAddPlant = async () => {
    if (!selectedPlant) return;

    try {
      // Create care instructions based on plant data
      const careInstructions: CareInstructions = {
        watering: {
          frequency: selectedPlant.watering || 'Weekly',
          amount: 'Moderate',
        },
        sunlight: {
          type: (selectedPlant.sunlight?.[0] as any) || 'partial sun',
          hours: '4-6 hours',
        },
        fertilizing: {
          frequency: 'Monthly',
          type: 'Balanced liquid fertilizer',
          season: 'Spring and Summer',
        },
        temperature: {
          min: 18,
          max: 24,
          unit: 'C',
        },
        humidity: '40-60%',
        soilType: 'Well-draining potting mix',
        repotting: 'Every 1-2 years',
        pruning: 'As needed to maintain shape',
      };

      const newPlant: Plant = {
        id: `user-${Date.now()}-${selectedPlant.id}`,
        name: plantName,
        scientificName: selectedPlant.scientific_name?.[0],
        commonNames: selectedPlant.other_name,
        description: `${selectedPlant.cycle} plant with ${selectedPlant.watering.toLowerCase()} watering needs`,
        imageUrl: selectedPlant.default_image?.regular_url,
        careInstructions,
        plantedDate: new Date(),
        location: plantLocation,
        isUserPlant: true,
        notes: plantNotes,
      };

      localStorageService.saveUserPlant(newPlant);
      localStorageService.generateCareTasks(newPlant);

      setShowAddDialog(false);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error adding plant:', error);
    }
  };

  const PlantCard = ({ plant }: { plant: PlantSearchResult }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="div"
        sx={{
          height: 160,
          bgcolor: 'primary.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {plant.default_image?.regular_url ? (
          <img
            src={plant.default_image.regular_url}
            alt={plant.common_name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <PlantIcon sx={{ fontSize: 60, color: 'white' }} />
        )}
      </CardMedia>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom noWrap>
          {plant.common_name}
        </Typography>

        {plant.scientific_name && plant.scientific_name.length > 0 && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <em>{plant.scientific_name[0]}</em>
          </Typography>
        )}

        <Box sx={{ mt: 1, mb: 1 }}>
          <Chip
            icon={<WaterIcon />}
            label={plant.watering}
            size="small"
            variant="outlined"
            sx={{ mr: 0.5, mb: 0.5 }}
          />
          {plant.sunlight && plant.sunlight.length > 0 && (
            <Chip
              icon={<SunIcon />}
              label={plant.sunlight[0]}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          )}
          <Chip
            label={plant.cycle}
            size="small"
            variant="outlined"
            sx={{ mr: 0.5, mb: 0.5 }}
          />
        </Box>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => openAddDialog(plant)}
          variant="contained"
          fullWidth
        >
          Add to Garden
        </Button>
        <IconButton
          size="small"
          onClick={() => {
            // Could navigate to plant details page
            console.log('Show details for:', plant.common_name);
          }}
        >
          <InfoIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Find Your Perfect Plant
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search through thousands of plants to add to your collection
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for plants (e.g., 'snake plant', 'succulent', 'low light')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: loading && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!searchQuery.trim() || loading}
            size="large"
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>
      </Box>

      {/* Results */}
      <Box>
        {!hasSearched && (
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Popular Indoor Plants
          </Typography>
        )}

        {hasSearched && (
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Search Results ({searchResults.length} plants found)
          </Typography>
        )}

        {searchResults.length === 0 && hasSearched && !loading && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <PlantIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No plants found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try searching with different keywords or check your spelling
            </Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          {searchResults.map((plant) => (
            <Grid key={plant.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <PlantCard plant={plant} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Add Plant Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Add {selectedPlant?.common_name} to Your Garden
          <IconButton
            aria-label="close"
            onClick={() => setShowAddDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {selectedPlant?.default_image?.regular_url && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar
                  src={selectedPlant.default_image.regular_url}
                  sx={{ width: 80, height: 80, mx: 'auto' }}
                >
                  <PlantIcon />
                </Avatar>
              </Box>
            )}

            <TextField
              fullWidth
              label="Plant Name"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              sx={{ mb: 2 }}
              helperText="Give your plant a personal name"
            />

            <TextField
              fullWidth
              label="Location"
              value={plantLocation}
              onChange={(e) => setPlantLocation(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="e.g., Living room, Kitchen windowsill"
              helperText="Where will you keep this plant?"
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={plantNotes}
              onChange={(e) => setPlantNotes(e.target.value)}
              placeholder="Any special notes about this plant..."
              helperText="Optional: Add any personal notes or observations"
            />

            {selectedPlant && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Care Summary:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip icon={<WaterIcon />} label={selectedPlant.watering} size="small" />
                  {selectedPlant.sunlight && selectedPlant.sunlight.length > 0 && (
                    <Chip icon={<SunIcon />} label={selectedPlant.sunlight[0]} size="small" />
                  )}
                  <Chip label={selectedPlant.cycle} size="small" />
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddPlant}
            variant="contained"
            disabled={!plantName.trim()}
          >
            Add to Garden
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Plant added to your garden successfully! 🌱
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PlantSearch; 