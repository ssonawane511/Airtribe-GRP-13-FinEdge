const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const logger = require('./src/middlewares/loggerMiddleware');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const userRoute = require('./src/routes/userRoute');
const transactionRoute = require('./src/routes/transactionRoute');
const summaryRoute = require('./src/routes/summaryRoute');
const port = Number(process.env.PORT) || 3000;
const mongoUri = process.env.MONGODB_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.use('/users', userRoute);
app.use('/transactions', transactionRoute);
app.use('/summary', summaryRoute);
app.use(errorMiddleware);

const startServer = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected');

        app.listen(port, (err) => {
            if (err) {
                return console.log('Something bad happened', err);
            }
            console.log(`Server is listening on ${port}`);
        });
    } catch (error) {
        console.error('Failed to connect MongoDB:', error.message);
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = app;
