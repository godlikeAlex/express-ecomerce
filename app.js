const express = require('express');
const app     = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/api', userRoutes);

const port = process.env.PORT || 3030;

app.listen(port, () => {
    console.log('Server Started!');
});
