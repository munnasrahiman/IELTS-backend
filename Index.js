import express from 'express';
import cors from 'cors';
import addRoutes from './routes/addRoute.js'
import authRoutes from './routes/authRoutes.js'
import getRoutes from './routes/getRoute.js'
import deleteRoutes from './routes/deleteRoute.js'
import updateRoutes from './routes/updateRoute.js'
import tutorRoutes from './routes/tutorRoutes.js';
import multer from "multer";
import db from './config/db.js';// Ensure the path to db.js is correct
import path from "path";
import chatRoutes from './routes/chatRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import { fileURLToPath } from 'url';
import feedbackRoutes from './routes/feedbackRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import tutorDashboardRoutes from './routes/tutorDashboardRoutes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use('/api/auth',authRoutes)
app.use('/api/add', addRoutes)
app.use('/api/get', getRoutes)
app.use('/api/update', updateRoutes)
app.use('/api/delete', deleteRoutes)
app.use('/api/tutor', tutorRoutes);
app.use('/api/chat', chatRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/resources', resourceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/tutor-dashboard', tutorDashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/certificates', express.static('certificates'));
app.use('/api/certificate', certificateRoutes);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../canteen/src/uploads'); // Save uploaded files in the 'uploads' folder
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp + file extension as filename
    }
  });
  
const upload = multer({ storage: storage });

app.post('/addProduct', upload.single('productImage'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: "No image file uploaded." });
        return;
    }

    const { productName, category, price, quantity } = req.body;  
    // Get only the filename without the path
    const imagePath = req.file.filename;

    const sql = "INSERT INTO products (name, category, price, quantity, image_url) VALUES (?, ?, ?, ?, ?)";
    const values = [productName, category, price, quantity, imagePath];  
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding service:', err);
            res.status(500).json({ error: 'Error adding service' });
            return;
        }
        console.log('Service added successfully');
        res.status(200).json({ message: 'Service added successfully' });
    });
});

app.post('/updateProduct', upload.single('productImage'), (req, res) => {
  if (!req.file) {
      res.status(400).json({ message: "No image file uploaded." });
      return;
  }

  const { productName,  price, quantity, id } = req.body;  
  const imagePath = req.file.filename;

  const sql = "UPDATE products SET name = ?,  price = ?, quantity = ?, image_url = ? WHERE id = ?";
  const values = [productName, price, quantity, imagePath, id];  

  db.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error updating product:', err);
          res.status(500).json({ error: 'Error updating product' });
          return;
      }
      console.log('Product updated successfully');
      res.status(200).json({ message: 'Product updated successfully' });
  });
});

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

// Error handling middleware
app.use((req, res) => {
    console.log('404 - Route not found:', req.url);
    res.status(404).json({ error: `Route ${req.url} not found` });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Available routes:');
    console.log('- GET /test');
    console.log('- GET /api/tutor/test');
    console.log('- GET /api/tutor/stats/:tutorId');
});
