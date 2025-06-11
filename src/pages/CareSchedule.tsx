import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Alert,
  Divider,
} from '@mui/material';
import {
  WaterDrop as WaterIcon,
  Agriculture as FertilizerIcon,
  ContentCut as PruningIcon,
  Schedule as ScheduleIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { localStorageService } from '../services/localStorage';
import { CareTask } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
  </div>
);

const CareSchedule: React.FC = () => {
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<CareTask | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const allTasks = localStorageService.getCareTasks();
    setTasks(allTasks);
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'watering':
        return <WaterIcon color="primary" />;
      case 'fertilizing':
        return <FertilizerIcon color="secondary" />;
      case 'pruning':
        return <PruningIcon color="action" />;
      default:
        return <ScheduleIcon />;
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleCompleteTask = (task: CareTask) => {
    setSelectedTask(task);
    setCompletionNotes('');
    setShowCompleteDialog(true);
  };

  const confirmCompleteTask = () => {
    if (selectedTask) {
      localStorageService.completeTask(selectedTask.id, completionNotes);
      loadTasks();
      setShowCompleteDialog(false);
    }
  };

  const getPendingTasks = () => {
    return tasks.filter(task => !task.isCompleted);
  };

  const getOverdueTasks = () => {
    return tasks.filter(task => !task.isCompleted && task.isOverdue);
  };

  const getUpcomingTasks = () => {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return tasks.filter(task => 
      !task.isCompleted && 
      !task.isOverdue && 
      task.scheduledDate <= weekFromNow
    );
  };

  const getCompletedTasks = () => {
    return tasks.filter(task => task.isCompleted);
  };

  const TaskList = ({ taskList, showEmpty = true }: { taskList: CareTask[]; showEmpty?: boolean }) => (
    <>
      {taskList.length === 0 && showEmpty ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <ScheduleIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body1" color="text.secondary">
            No tasks in this category
          </Typography>
        </Box>
      ) : (
        <List>
          {taskList.map((task, index) => (
            <React.Fragment key={task.id}>
              <ListItem
                sx={{
                  bgcolor: task.isOverdue ? 'error.50' : 'transparent',
                  borderRadius: 1,
                  mb: 1,
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
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="body1"
                        color={task.isOverdue ? 'error.main' : 'text.primary'}
                      >
                        {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)} {task.plantName}
                      </Typography>
                      {task.isOverdue && (
                        <Chip label="Overdue" color="error" size="small" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {task.isCompleted 
                          ? `Completed: ${formatDate(task.completedDate!)}`
                          : `Due: ${formatDate(task.scheduledDate)}`
                        }
                      </Typography>
                      {task.notes && (
                        <Typography variant="caption" color="text.secondary">
                          Note: {task.notes}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  {!task.isCompleted && (
                    <IconButton
                      edge="end"
                      onClick={() => handleCompleteTask(task)}
                      color="primary"
                    >
                      <CheckIcon />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              {index < taskList.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </>
  );

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Care Schedule
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Keep track of your plant care tasks and schedule
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Chip
          icon={<WarningIcon />}
          label={`${getOverdueTasks().length} Overdue`}
          color={getOverdueTasks().length > 0 ? 'error' : 'default'}
        />
        <Chip
          icon={<ScheduleIcon />}
          label={`${getUpcomingTasks().length} This Week`}
          color="primary"
        />
        <Chip
          icon={<CheckIcon />}
          label={`${getCompletedTasks().length} Completed`}
          color="success"
        />
      </Box>

      {/* Overdue Alert */}
      {getOverdueTasks().length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You have {getOverdueTasks().length} overdue task{getOverdueTasks().length > 1 ? 's' : ''}! 
          Your plants need attention.
        </Alert>
      )}

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
          >
            <Tab label="Pending" />
            <Tab label="This Week" />
            <Tab label="Completed" />
          </Tabs>
        </Box>

        <CardContent>
          <TabPanel value={tabValue} index={0}>
            <TaskList taskList={getPendingTasks()} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TaskList taskList={getUpcomingTasks()} />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <TaskList taskList={getCompletedTasks().slice(0, 20)} />
          </TabPanel>
        </CardContent>
      </Card>

      {/* Complete Task Dialog */}
      <Dialog
        open={showCompleteDialog}
        onClose={() => setShowCompleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Complete Task: {selectedTask?.taskType} {selectedTask?.plantName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Mark this task as completed and optionally add notes about the care provided.
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes (optional)"
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder="e.g., Watered thoroughly, soil was dry, plant looks healthy..."
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCompleteDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={confirmCompleteTask}
            variant="contained"
            startIcon={<CheckIcon />}
          >
            Mark Complete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CareSchedule; 