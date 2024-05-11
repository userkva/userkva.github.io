import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Grid } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';
import Cookies from 'js-cookie';
import { BarChart } from "@mui/x-charts";
import './App.css';

function App() {
  const [activities, setActivities] = useState(() => {
    // Load activities from cookies at initialization
    const savedActivities = Cookies.get('activities');
    return savedActivities ? JSON.parse(savedActivities) : [
      { name: "Work", hours: 40 },
      { name: "Language Lessons", hours: 3 }
    ];
  });
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityHours, setNewActivityHours] = useState(0);

  const [limit, setLimit] = useState(50); // Default limit
  const [limitError, setLimitError] = useState(''); // To hold the error message for the limit

  const [selectedActivityIndex, setSelectedActivityIndex] = useState(null); // null when no activity is selected

  // Effect to store activities in cookies
  useEffect(() => {
    Cookies.set('activities', JSON.stringify(activities), { expires: 365 });
  }, [activities]);

  const handleLimitChange = (event) => {
    const newLimit = event.target.value;
    if (newLimit > 168) {
      setLimitError("The maximum limit cannot exceed 168 hours per week.");
    } else {
      setLimitError('');
      setLimit(newLimit);
    }
  };

  const addActivity = () => {
    if (!newActivityName || newActivityHours <= 0) return;
    setActivities([...activities, { name: newActivityName, hours: parseFloat(newActivityHours) }].sort((a, b) => b.hours - a.hours));
    setNewActivityName('');
    setNewActivityHours(0);
  };

  const resetActivities = () => {
    setActivities([]);
    Cookies.remove('activities'); // Clear the cookie
  };

  const onItemClick = (event, params) => { selectActivity(params.dataIndex); };

  const selectActivity = (index) => {
    setSelectedActivityIndex(index);
    setNewActivityName(activities[index].name);
    setNewActivityHours(activities[index].hours);
  };

  const editActivity = () => {
    const updatedActivities = [...activities];
    updatedActivities[selectedActivityIndex] = { ...updatedActivities[selectedActivityIndex], name: newActivityName, hours: parseFloat(newActivityHours) };
    setActivities(updatedActivities);
    resetSelection();
  };

  const removeActivity = () => {
    const updatedActivities = [...activities];
    updatedActivities.splice(selectedActivityIndex, 1);
    setActivities(updatedActivities);
    resetSelection();
  };

  const resetSelection = () => {
    setSelectedActivityIndex(null);
    setNewActivityName('');
    setNewActivityHours(0);
  };

  const totalHours = activities.reduce((sum, item) => sum + item.hours, 0);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom style={{ marginTop: '20px' }}>
        Weekly Load Planner
      </Typography>
      <form noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <p></p>
        <Box marginBottom={2} >
          <TextField
            label="What are you planning to do?"
            variant="outlined"
            fullWidth
            value={newActivityName}
            onChange={(e) => setNewActivityName(e.target.value)}
            placeholder="Enter activity name"
          />
        </Box>
        <p></p>
        <Box marginBottom={2}>
          <TextField
            label="Hours per Week"
            type="number"
            variant="outlined"
            fullWidth
            value={newActivityHours}
            onChange={(e) => setNewActivityHours(e.target.value)}
            placeholder="Enter hours"
          />
        </Box>
        <p></p>
        <Grid container spacing={2} justifyContent="flex-end" style={{ marginTop: '20px' }}>
          {selectedActivityIndex === null ? (
            <>
              <Grid item xs>
                <Button variant="contained" color="primary" onClick={addActivity}>
                  Add Activity
                </Button>
              </Grid>
              <Grid item xs></Grid>
              <Grid item xs>
                <Button variant="contained" color="secondary" onClick={resetActivities}>
                  Reset Activities
                </Button>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs>
                <Button variant="contained" color="primary" onClick={editActivity}>
                  Edit Activity
                </Button>
              </Grid>
              <Grid item xs>
                <Button variant="contained" color="secondary" onClick={removeActivity} >
                  Delete Activity
                </Button>
              </Grid>
              <Grid item xs>
                <Button variant="contained" onClick={resetSelection}>
                  Cancel
                </Button>
              </Grid>
            </>
          )}
        </Grid>
        <p></p>
        <Grid container spacing={2} alignItems="center" style={{ marginTop: '20px' }}>
          <Grid item xs={6}>
            <TextField
              label="Weekly Hours Limit"
              type="number"
              variant="outlined"
              fullWidth
              value={limit}
              onChange={(e) => handleLimitChange(e)}
              placeholder="Set your weekly limit"
              error={!!limitError}
              helperText={limitError}
              InputProps={{
                endAdornment: (
                  <Tooltip title={<Typography fontSize={30}>"Set a healthy balance! According to WHO, working 55 hours or more per week is a serious health hazard. Don't forget to leave time for rest and personal care."</Typography>}>
                    <InfoIcon color="action" style={{ cursor: 'pointer' }} />
                  </Tooltip>
                )
              }}
            />
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={5}>
            <Typography variant="h6" style={{ color: totalHours > limit ? 'red' : 'black' }}>
              Total Hours: {totalHours} / {limit}
            </Typography>
          </Grid>
        </Grid>

      </form>
      <p></p>
      <BarChart
        leftAxis={null}
        bottomAxis={{
          label: "Hours spent",
        }}
        dataset={activities.map(activity => ({
          name: activity.name,
          value: activity.hours
        }))}
        yAxis={[{
          scaleType: 'band',
          dataKey: 'name',
        }]}
        xAxis={[{
          colorMap: {
            type: 'continuous',
            min: 0,
            max: limit,
            color: ['green', 'red']
          },
          min: 0,
          max: limit > totalHours ? limit : totalHours
        }]}
        series={[{
          dataKey: 'value',
        }]}
        layout="horizontal"
        fullWidth
        height={300}
        grid={{ vertical: true }}
        onItemClick={onItemClick}
      />

    </Container>
  );
}

export default App;
