const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_PATH = path.join(__dirname, 'data', 'hospitals.json');

app.use(express.json());

// Helper function to read JSON data from file
const readData = () => {
  const data = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write JSON data to file
const writeData = (data) => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
};

// GET all hospitals
app.get('/hospitals', (req, res) => {
  const hospitals = readData();
  res.json(hospitals);
});

// POST a new hospital
app.post('/hospitals', (req, res) => {
  const hospitals = readData();
  const newHospital = {
    id: Date.now().toString(),
    name: req.body.name,
    patientCount: req.body.patientCount,
    location: req.body.location,
  };
  hospitals.push(newHospital);
  writeData(hospitals);
  res.status(201).json(newHospital);
});

// PUT update a hospital by id
app.put('/hospitals/:id', (req, res) => {
  const hospitals = readData();
  const hospitalIndex = hospitals.findIndex(h => h.id === req.params.id);
  if (hospitalIndex === -1) {
    return res.status(404).json({ message: 'Hospital not found' });
  }
  const updatedHospital = {
    ...hospitals[hospitalIndex],
    name: req.body.name,
    patientCount: req.body.patientCount,
    location: req.body.location,
  };
  hospitals[hospitalIndex] = updatedHospital;
  writeData(hospitals);
  res.json(updatedHospital);
});

// DELETE a hospital by id
app.delete('/hospitals/:id', (req, res) => {
  const hospitals = readData();
  const updatedHospitals = hospitals.filter(h => h.id !== req.params.id);
  if (hospitals.length === updatedHospitals.length) {
    return res.status(404).json({ message: 'Hospital not found' });
  }
  writeData(updatedHospitals);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});