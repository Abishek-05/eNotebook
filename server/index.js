const connectToMongo = require('./db');
const express = require('express');
const authRouter = require('./routes/auth');
const notesRouter = require('./routes/notes');
const cors = require('cors');
connectToMongo();

const app = express();
const port = 5000;

app.use(express.json()); //Used to get access to req body
// app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);

app.listen(port, () => {
  console.log(`eNotebook backend listening on port ${port}`)
});