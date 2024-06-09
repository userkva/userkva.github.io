import React from 'react';
import { Container, Typography } from '@material-ui/core';

function NewInstrument() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom style={{ marginTop: '20px' }}>
        New Instrument
      </Typography>
      <Typography variant="body1">
        This is the placeholder for the new instrument.
      </Typography>
    </Container>
  );
}

export default NewInstrument;
