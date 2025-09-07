const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `recording_${timestamp}${ext}`);
  }
});

const upload = multer({ storage });

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
// POST /api/upload - Upload a recording
app.post('/api/upload', upload.single('recording'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Return the file details
  res.json({ 
    message: 'File uploaded successfully',
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
});

// GET /api/recordings - Get all recordings
app.get('/api/recordings', (req, res) => {
  const uploadsDir = path.join(__dirname, 'uploads');
  
  // Read the uploads directory
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
      return res.status(500).json({ error: 'Failed to read recordings directory' });
    }
    
    // Filter for media files and create response objects
    const recordings = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.webm', '.mp4', '.mpeg', '.ogg', '.wav'].includes(ext);
      })
      .map(file => ({
        id: file.split('_')[1]?.split('.')[0] || file,
        filename: file,
        url: `/uploads/${file}`,
        date: new Date(parseInt(file.split('_')[1]?.split('.')[0]) || Date.now()).toISOString()
      }))
      .sort((a, b) => b.date.localeCompare(a.date)); // Sort by date (newest first)
    
    res.json(recordings);
  });
});

// For production - serve the frontend static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Uploads directory: ${path.join(__dirname, 'uploads')}`);
});
