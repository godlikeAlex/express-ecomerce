const express = require('express');
const app     = express();
const mongoose = require('mongoose');
require('dotenv').config();

// Routes
const userRoutes = require('./routes/user');


// Database Connection
mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})
    .then(() => console.log('Database success connected.'))
    .catch(() => console.error('Error to connect to database.'));

// Routes
app.use('/api', userRoutes);

const port = process.env.PORT || 3030;

app.listen(port, () => {
    console.log('Server Started!');
});
