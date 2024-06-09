import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Box, IconButton, Button, Grid, Paper } from '@material-ui/core';
import { Delete, Add } from '@material-ui/icons';

function EditableField({ label, onUpdate = undefined, showLabel = true, logEdit = undefined, defaultValue = undefined }) {
  const [value, setValue] = useState(localStorage.getItem(label) || defaultValue || `Click to enter ${label.toLowerCase()}`);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem(label, value);
  }, [value]);

  const stopEditing = () => {
    setIsEditing(false);
    if (onUpdate) onUpdate(value);
    if (logEdit) logEdit(label, value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      stopEditing();
    }
  };

  return isEditing ? (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={stopEditing}
      onKeyPress={handleKeyPress}
      autoFocus
    />
  ) : (
    <Typography
      variant="h6"
      onClick={() => setIsEditing(true)}
      style={{ cursor: 'pointer' }}
    >
      {showLabel && `${label}: `}{value || `Click to enter ${label.toLowerCase()}`}
    </Typography>
  );
}

function ImageUploader() {
  const [image, setImage] = useState(() => {
    const savedImage = localStorage.getItem('image');
    return savedImage ? savedImage : null;
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setImage(base64Image);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (image) {
      localStorage.setItem('image', image);
    }
  }, [image]);

  return (
    <Box textAlign="center" my={2}>
      {image ? (
        <img
          src={image}
          alt="Character"
          style={{ maxWidth: '100%', height: 'auto', cursor: 'pointer', borderRadius: '10px' }}
          onClick={() => document.getElementById('imageUpload').click()}
        />
      ) : (
        <Typography
          variant="body1"
          onClick={() => document.getElementById('imageUpload').click()}
          style={{ cursor: 'pointer' }}
        >
          No image uploaded
        </Typography>
      )}
      <input
        type="file"
        id="imageUpload"
        hidden
        accept="image/*"
        onChange={handleImageUpload}
      />
    </Box>
  );
}

function CharacterAttributes({ attributes, setAttributes, logEdit }) {
  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', value: 0, maxValue: 100 }]);
  };

  const handleDeleteAttribute = (index) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const handleEditAttribute = (index, key, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][key] = value;
    setAttributes(newAttributes);
    logEdit(key, value);
  };

  return (
    <Box mt={2}>
      <Paper elevation={2} style={{ padding: '20px', borderRadius: '10px' }}>
        <Typography variant="h5" gutterBottom>Characteristics</Typography>
        {attributes.map((attribute, index) => (
          <Grid container alignItems="center" spacing={2} key={index} style={{ marginBottom: '10px' }}>
            <Grid item xs={3}>
              <EditableField
                label="Attribute Name"
                showLabel={false}
                defaultValue={"Name"}
                onUpdate={(value) => handleEditAttribute(index, 'name', value)}
              />
            </Grid>
            <Grid item xs={3}>
              <EditableField
                label={`${attribute.name} value`}
                showLabel={false}
                defaultValue={"0"}
                onUpdate={(value) => handleEditAttribute(index, 'value', parseInt(value, 10))}
                logEdit={logEdit}
              />
            </Grid>
            <Grid item xs={1}>
              <Typography variant="h6">/</Typography>
            </Grid>
            <Grid item xs={3}>
              <EditableField
                label="Max Value"
                showLabel={false}
                defaultValue={"100"}
                onUpdate={(value) => handleEditAttribute(index, 'maxValue', parseInt(value, 10))}
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => handleDeleteAttribute(index)}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Box textAlign="center" mt={2}>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddAttribute}>
            Add
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

function Chat({ chatMessages, addChatMessage }) {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    addChatMessage(newMessage);
    setNewMessage('');
  };

  return (
    <Box mt={3}>
      <Typography variant="h5" style={{ padding: '5px' }}>History</Typography>

      <Box display="flex" alignItems="center">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={10}>
            <TextField
              label="New character update"
              variant="outlined"
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                  e.preventDefault();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              style={{ marginLeft: '10px', height: '56px' }}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box display="flex" flexDirection="column" maxHeight="200px" overflow="auto" border={1} borderColor="grey.400" borderRadius={4} p={2} mb={2}>
        {chatMessages.map((msg, index) => (
          <Typography key={index} variant="body2" style={{ marginBottom: '10px', fontStyle: 'italic' }}>
            {msg}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

function CharacterEditor() {
  const [characterName, setCharacterName] = useState(localStorage.getItem("Name") || "Character");
  const [attributes, setAttributes] = useState(() => {
    const savedAttributes = localStorage.getItem('attributes');
    return savedAttributes ? JSON.parse(savedAttributes) : [{ name: 'Strength', value: 50, maxValue: 100 }];
  });
  const [chatMessages, setChatMessages] = useState(() => {
    const savedChatMessages = localStorage.getItem('chatMessages');
    return savedChatMessages ? JSON.parse(savedChatMessages) : [];
  });

  useEffect(() => {
    localStorage.setItem('attributes', JSON.stringify(attributes));
  }, [attributes]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const addChatMessage = (message) => {
    setChatMessages([message, ...chatMessages]);
  };

  const logEdit = (field, value) => {
    addChatMessage(`${characterName}'s ${field} updated to: ${value}!`);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Character Editor
      </Typography>
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '10px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Paper elevation={2} style={{ padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <EditableField label="Name" onUpdate={setCharacterName} logEdit={logEdit} />
                <EditableField label="Level" logEdit={logEdit} />
                <EditableField label="Title" logEdit={logEdit} />
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} container justifyContent="center" alignItems="center">
            <ImageUploader/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CharacterAttributes attributes={attributes} setAttributes={setAttributes} logEdit={logEdit} />
          </Grid>
        </Grid>
        <Paper elevation={2} style={{ padding: '20px', borderRadius: '10px', marginTop: '20px' }}>
          <Chat chatMessages={chatMessages} addChatMessage={addChatMessage} />
        </Paper>
      </Paper>
    </Container>
  );
}

export default CharacterEditor;
