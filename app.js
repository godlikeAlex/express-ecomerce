const express = require('express');
const app     = express();
const mongoose = require('mongoose');
require('dotenv').config();


// Database Connection
mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})
    .then(() => console.log('Database success connected.'))
    .catch(() => console.error('Error to connect to database.'));

// Routes
app.get('/', (req, res) => {
    res.send('hello from node');
});

const port = process.env.PORT || 3030;

app.listen(3030, () => {
    console.log('Server Started!');
});
