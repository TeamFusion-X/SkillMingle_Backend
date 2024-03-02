const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

const port = process.env.PORT || 5500;

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}..`);
})