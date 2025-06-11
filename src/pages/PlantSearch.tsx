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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  LocalFlorist as PlantIcon,
  WbSunny as SunIcon,
  WaterDrop as WaterIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  Restaurant as EdibleIcon,
  Warning as PoisonIcon,
  Home as IndoorIcon,
  Thermostat as HardinessIcon,
} from '@mui/icons-material';
import { plantApiService, PlantSearchFilters } from '../services/plantApi';
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
  
  // Enhanced filter states
  const [filters, setFilters] = useState<PlantSearchFilters>({
    query: '',
    page: 1,
    indoor: true, // Default to indoor plants
    order: 'asc'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Load popular indoor plants on component mount
    loadPopularPlants();
  }, []);

  const loadPopularPlants = async () => {
    setLoading(true);
    try {
      const results = await plantApiService.searchIndoorPlants('', 1);
      setSearchResults(results.slice(0, 6));
    } catch (error) {
      console.error('Error loading popular plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const searchFilters = { ...filters, query: searchQuery };
      const results = await plantApiService.searchPlants(searchFilters);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching plants:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFilter = async (filterType: string) => {
    setLoading(true);
    setHasSearched(true);
    try {
      let results: PlantSearchResult[] = [];
      
      switch (filterType) {
        case 'indoor':
          results = await plantApiService.searchIndoorPlants(searchQuery);
          break;
        case 'edible':
          results = await plantApiService.searchEdiblePlants(searchQuery);
          break;
        case 'low-maintenance':
          results = await plantApiService.searchLowMaintenancePlants(searchQuery);
          break;
        default:
          results = await plantApiService.searchPlants({ query: searchQuery });
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error with quick filter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof PlantSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      page: 1,
      order: 'asc'
    });
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
          
          {/* Enhanced chips with safety information */}
          {plant.indoor && (
            <Chip
              icon={<IndoorIcon />}
              label="Indoor"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          )}
          
          {plant.edible_leaf && (
            <Chip
              icon={<EdibleIcon />}
              label="Edible"
              size="small"
              color="success"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          )}
          
          {plant.poisonous_to_humans && (
            <Tooltip title="Poisonous to humans">
              <Chip
                icon={<PoisonIcon />}
                label="Toxic"
                size="small"
                color="error"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            </Tooltip>
          )}
          
          {plant.poisonous_to_pets && (
            <Tooltip title="Poisonous to pets">
              <Chip
                icon={<PoisonIcon />}
                label="Pet Toxic"
                size="small"
                color="warning"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            </Tooltip>
          )}

          {plant.care_level && (
            <Chip
              label={`${plant.care_level} Care`}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          )}
        </Box>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openAddDialog(plant)}
          fullWidth
        >
          Add to Garden
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Discover Plants
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore over 10,000 plant species with detailed care information
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for plants by name, type, or characteristics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  disabled={loading}
                  sx={{ mr: 1 }}
                >
                  Search
                </Button>
                <IconButton onClick={() => setShowFilters(!showFilters)}>
                  <FilterIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Quick Filter Buttons */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Filters
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<IndoorIcon />}
            onClick={() => handleQuickFilter('indoor')}
            disabled={loading}
          >
            Indoor Plants
          </Button>
          <Button
            variant="outlined"
            startIcon={<EdibleIcon />}
            onClick={() => handleQuickFilter('edible')}
            disabled={loading}
          >
            Edible Plants
          </Button>
          <Button
            variant="outlined"
            startIcon={<WaterIcon />}
            onClick={() => handleQuickFilter('low-maintenance')}
            disabled={loading}
          >
            Low Maintenance
          </Button>
        </Box>
      </Box>

      {/* Advanced Filters */}
      {showFilters && (
        <Accordion sx={{ mb: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Advanced Filters</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Plant Cycle</InputLabel>
                  <Select
                    value={filters.cycle || ''}
                    onChange={(e) => handleFilterChange('cycle', e.target.value)}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="perennial">Perennial</MenuItem>
                    <MenuItem value="annual">Annual</MenuItem>
                    <MenuItem value="biennial">Biennial</MenuItem>
                    <MenuItem value="biannual">Biannual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Watering Needs</InputLabel>
                  <Select
                    value={filters.watering || ''}
                    onChange={(e) => handleFilterChange('watering', e.target.value)}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="frequent">Frequent</MenuItem>
                    <MenuItem value="average">Average</MenuItem>
                    <MenuItem value="minimum">Minimum</MenuItem>
                    <MenuItem value="none">None</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Sunlight Requirements</InputLabel>
                  <Select
                    value={filters.sunlight || ''}
                    onChange={(e) => handleFilterChange('sunlight', e.target.value)}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="full_sun">Full Sun</MenuItem>
                    <MenuItem value="sun-part_shade">Sun-Part Shade</MenuItem>
                    <MenuItem value="part_shade">Part Shade</MenuItem>
                    <MenuItem value="full_shade">Full Shade</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Hardiness Zone</InputLabel>
                  <Select
                    value={filters.hardiness || ''}
                    onChange={(e) => handleFilterChange('hardiness', e.target.value)}
                  >
                    <MenuItem value="">Any</MenuItem>
                    {Array.from({ length: 13 }, (_, i) => i + 1).map(zone => (
                      <MenuItem key={zone} value={zone}>Zone {zone}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.indoor || false}
                      onChange={(e) => handleFilterChange('indoor', e.target.checked)}
                    />
                  }
                  label="Indoor Plants Only"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.edible || false}
                      onChange={(e) => handleFilterChange('edible', e.target.checked)}
                    />
                  }
                  label="Edible Plants Only"
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" onClick={handleSearch} disabled={loading}>
                    Apply Filters
                  </Button>
                  <Button variant="outlined" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

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