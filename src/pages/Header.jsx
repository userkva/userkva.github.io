import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Kva's nest
        </Typography>
        <Button color="inherit" component={Link} to="/">Main Page</Button>
        <Button color="inherit" component={Link} to="/planner">Weekly Load Planner</Button>
        <Button color="inherit" component={Link} to="/сharacter-editor">Character Editor</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
