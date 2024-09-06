import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT;

app.get('/', async (req, res) => {
  res.send('TEST');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
