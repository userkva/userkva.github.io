import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './Header';
import WeeklyLoadPlanner from './WeeklyLoadPlanner';
import CharacterEditor from './CharacterEditor';
import { Container, Typography, Box, Button } from '@material-ui/core';

function MainPage() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom style={{ marginTop: '20px' }}>
        Welcome
      </Typography>
      <Typography variant="body1" style={{ marginBottom: '20px' }}>
        This is just my personal page with some tools. Majority of code is auto-generated. All your data is stored locally and only locally. 
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom>
        Tools:
      </Typography>
      <ul>
        <li>
        <Typography variant="body1">
            <Link to="/planner">Weekly Load Planner</Link> - A tool to plan and track your weekly activities and hours.
          </Typography>
        </li>
        <li>
          <Typography variant="body1">
            <Link to="/сharacter-editor">Character Editor</Link> - A narrative tool to create and customize your own character.
          </Typography>
        </li>
      </ul>
    </Container>
  );
}

function Main() {
  return (
    <Router>
      <Header />
      <Routes>
      <Route path="/" element={<MainPage />} />
        <Route path="/planner" element={<WeeklyLoadPlanner />} />
        <Route path="/сharacter-editor" element={<CharacterEditor />} />
      </Routes>
    </Router>
  );
}

export default Main;

