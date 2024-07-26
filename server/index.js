import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { router } from './routes/assetsRoutes.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 3000;
const SECRET_KEY = process.env.SECRET_KEY; // Ensure this is stored securely in production

app.use(bodyParser.json());

// Middleware to authenticate JWT tokens
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Apply the JWT authentication middleware to all routes
app.use('/api', authenticateToken, router);

// Endpoint to generate a token
app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
