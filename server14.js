const express = require('express');
const Joi = require('joi');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
app.use(express.json());
app.use(cors());

const craftsFilePath = './crafts.json';

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Validation schema for craft object
const craftSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
  description: Joi.string().required(),
  supplies: Joi.array().items(Joi.string()).required(),
});

// Read crafts data from JSON file
async function getCraftsData() {
  try {
    const data = await fs.readFile(craftsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading crafts data:', error);
    return [];
  }
}

// Write crafts data to JSON file
async function saveCraftsData(crafts) {
  try {
    await fs.writeFile(craftsFilePath, JSON.stringify(crafts, null, 2));
    console.log('Crafts data saved successfully.');
  } catch (error) {
    console.error('Error saving crafts data:', error);
  }
}

// Get all crafts
app.get('/crafts', async (req, res) => {
  const crafts = await getCraftsData();
  res.json(crafts);
});

// Add a new craft
app.post('/crafts', upload.single('image'), async (req, res) => {
  try {
    const { name, description, supplies } = req.body;
    const image = req.file ? req.file.path : '';
    const newCraft = { name, image, description, supplies };
    
    // Validate the new craft object
    const { error } = craftSchema.validate(newCraft);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Read existing crafts data
    let crafts = await getCraftsData();

    // Add the new craft to the array
    crafts.push(newCraft);

    // Save updated crafts data
    await saveCraftsData(crafts);

    res.status(201).json(newCraft);
  } catch (error) {
    console.error('Error adding craft:', error);
    res.status(500).send('Error adding craft');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
