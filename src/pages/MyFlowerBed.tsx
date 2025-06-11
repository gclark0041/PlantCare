import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Grid,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Chip,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  WaterDrop as WaterIcon,
  LocalFlorist as PlantIcon,
  PhotoCamera as PhotoIcon,
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  ViewModule as ViewIcon,
  ViewList as ListIcon,
  MoreVert as MoreIcon,
  Agriculture as FertilizerIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { localStorageService } from '../services/localStorage';
import { Plant } from '../types';

interface PersonalizationSettings {
  gardenName: string;
  layout: 'grid' | 'list';
  showLastCareDate: boolean;
  showCareInstructions: boolean;
  sortBy: 'name' | 'dateAdded' | 'lastCared';
  backgroundColor: string;
  accentColor: string;
}

const MyFlowerBed: React.FC = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [showPersonalizationDialog, setShowPersonalizationDialog] = useState(false);
  const [showPlantDialog, setShowPlantDialog] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [personalization, setPersonalization] = useState<PersonalizationSettings>({
    gardenName: 'My Flower Bed',
    layout: 'grid',
    showLastCareDate: true,
    showCareInstructions: false,
    sortBy: 'name',
    backgroundColor: '#F1F8F1',
    accentColor: '#2E7D32',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const userPlants = localStorageService.getUserPlants();
    setPlants(userPlants);
    
    // Load personalization settings
    const savedSettings = localStorage.getItem('flower_bed_personalization');
    if (savedSettings) {
      setPersonalization(JSON.parse(savedSettings));
    }
  };

  const savePersonalization = (settings: PersonalizationSettings) => {
    setPersonalization(settings);
    localStorage.setItem('flower_bed_personalization', JSON.stringify(settings));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, plant: Plant) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlant(plant);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPlant(null);
  };

  const handleEditPlant = () => {
    if (selectedPlant) {
      setEditingPlant(selectedPlant);
      setShowPlantDialog(true);
    }
    handleMenuClose();
  };

  const handleDeletePlant = () => {
    if (selectedPlant) {
      localStorageService.deleteUserPlant(selectedPlant.id);
      loadData();
    }
    handleMenuClose();
  };

  const handleWaterPlant = () => {
    if (selectedPlant) {
      localStorageService.updatePlantCareDate(selectedPlant.id, 'watered');
      loadData();
    }
    handleMenuClose();
  };

  const handleFertilizePlant = () => {
    if (selectedPlant) {
      localStorageService.updatePlantCareDate(selectedPlant.id, 'fertilized');
      loadData();
    }
    handleMenuClose();
  };

  const getSortedPlants = () => {
    const sortedPlants = [...plants];
    switch (personalization.sortBy) {
      case 'name':
        return sortedPlants.sort((a, b) => a.name.localeCompare(b.name));
      case 'dateAdded':
        return sortedPlants.sort((a, b) => 
          (b.plantedDate?.getTime() || 0) - (a.plantedDate?.getTime() || 0)
        );
      case 'lastCared':
        return sortedPlants.sort((a, b) => 
          (b.lastWatered?.getTime() || 0) - (a.lastWatered?.getTime() || 0)
        );
      default:
        return sortedPlants;
    }
  };

  const formatLastCareDate = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const PlantCard = ({ plant }: { plant: Plant }) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: 2,
        '&:hover': { boxShadow: 4 },
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: 140,
          bgcolor: 'primary.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {plant.imageUrl ? (
          <img 
            src={plant.imageUrl} 
            alt={plant.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <PlantIcon sx={{ fontSize: 60, color: 'white' }} />
        )}
      </CardMedia>
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom noWrap>
          {plant.name}
        </Typography>
        
        {plant.scientificName && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <em>{plant.scientificName}</em>
          </Typography>
        )}

        {personalization.showLastCareDate && (
          <Box sx={{ mt: 1 }}>
            <Chip
              icon={<WaterIcon />}
              label={`Watered: ${formatLastCareDate(plant.lastWatered)}`}
              size="small"
              variant="outlined"
              sx={{ mb: 0.5 }}
            />
          </Box>
        )}

        {personalization.showCareInstructions && plant.careInstructions && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Water: {plant.careInstructions.watering?.frequency || 'As needed'}
            </Typography>
          </Box>
        )}

        {plant.location && (
          <Chip
            label={plant.location}
            size="small"
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>

      <CardActions>
        <IconButton
          size="small"
          onClick={() => handleWaterPlant()}
          color="primary"
          title="Mark as watered"
        >
          <WaterIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => handleFertilizePlant()}
          color="secondary"
          title="Mark as fertilized"
        >
          <FertilizerIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, plant)}
          title="More options"
        >
          <MoreIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  const PlantListItem = ({ plant }: { plant: Plant }) => (
    <Card sx={{ mb: 1 }}>
      <ListItem>
        <Avatar
          src={plant.imageUrl}
          sx={{ bgcolor: 'primary.light', mr: 2 }}
        >
          <PlantIcon />
        </Avatar>
        <ListItemText
          primary={plant.name}
          secondary={
            <Box>
              {plant.scientificName && (
                <Typography variant="caption" display="block">
                  <em>{plant.scientificName}</em>
                </Typography>
              )}
              {personalization.showLastCareDate && (
                <Typography variant="caption" color="text.secondary">
                  Last watered: {formatLastCareDate(plant.lastWatered)}
                </Typography>
              )}
            </Box>
          }
        />
        <ListItemSecondaryAction>
          <IconButton onClick={(e) => handleMenuOpen(e, plant)}>
            <MoreIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </Card>
  );

  const speedDialActions = [
    {
      icon: <AddIcon />,
      name: 'Add Plant',
      action: () => navigate('/plant-search'),
    },
    {
      icon: <PaletteIcon />,
      name: 'Personalize',
      action: () => setShowPersonalizationDialog(true),
    },
    {
      icon: <ScheduleIcon />,
      name: 'Schedule Care',
      action: () => navigate('/care-schedule'),
    },
  ];

  return (
    <Box sx={{ bgcolor: personalization.backgroundColor, minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              {personalization.gardenName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {plants.length} plants in your collection
            </Typography>
          </Box>
          
          <Box>
            <IconButton
              onClick={() => setPersonalization(prev => ({ 
                ...prev, 
                layout: prev.layout === 'grid' ? 'list' : 'grid' 
              }))}
              title="Toggle layout"
            >
              {personalization.layout === 'grid' ? <ListIcon /> : <ViewIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Empty state */}
        {plants.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <PlantIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Your garden is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Start building your personal plant collection by searching for plants and adding them to your garden.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => navigate('/plant-search')}
            >
              Add Your First Plant
            </Button>
          </Box>
        )}

        {/* Plants display */}
        {plants.length > 0 && (
          <>
            {personalization.layout === 'grid' ? (
              <Grid container spacing={3}>
                {getSortedPlants().map((plant) => (
                  <Grid key={plant.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <PlantCard plant={plant} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <List>
                {getSortedPlants().map((plant) => (
                  <PlantListItem key={plant.id} plant={plant} />
                ))}
              </List>
            )}
          </>
        )}

        {/* Speed Dial */}
        <SpeedDial
          ariaLabel="Garden actions"
          sx={{ position: 'fixed', bottom: 80, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.action}
            />
          ))}
        </SpeedDial>

        {/* Plant menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleWaterPlant}>
            <WaterIcon sx={{ mr: 1 }} /> Mark as Watered
          </MenuItem>
          <MenuItem onClick={handleFertilizePlant}>
            <FertilizerIcon sx={{ mr: 1 }} /> Mark as Fertilized
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleEditPlant}>
            <EditIcon sx={{ mr: 1 }} /> Edit Plant
          </MenuItem>
          <MenuItem onClick={handleDeletePlant} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} /> Remove Plant
          </MenuItem>
        </Menu>

        {/* Personalization Dialog */}
        <Dialog
          open={showPersonalizationDialog}
          onClose={() => setShowPersonalizationDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Personalize Your Garden</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Garden Name"
                value={personalization.gardenName}
                onChange={(e) => setPersonalization(prev => ({ ...prev, gardenName: e.target.value }))}
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={personalization.showLastCareDate}
                    onChange={(e) => setPersonalization(prev => ({ ...prev, showLastCareDate: e.target.checked }))}
                  />
                }
                label="Show last care dates"
                sx={{ mb: 1 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={personalization.showCareInstructions}
                    onChange={(e) => setPersonalization(prev => ({ ...prev, showCareInstructions: e.target.checked }))}
                  />
                }
                label="Show care instructions"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                select
                label="Sort plants by"
                value={personalization.sortBy}
                onChange={(e) => setPersonalization(prev => ({ 
                  ...prev, 
                  sortBy: e.target.value as 'name' | 'dateAdded' | 'lastCared' 
                }))}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="dateAdded">Date Added</MenuItem>
                <MenuItem value="lastCared">Last Cared For</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPersonalizationDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                savePersonalization(personalization);
                setShowPersonalizationDialog(false);
              }}
              variant="contained"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyFlowerBed; 