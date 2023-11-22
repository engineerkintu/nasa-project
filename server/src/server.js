const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const {loadPlanetsData} = require('./models/planets.model');

const PORT = process.env.PORT || 8007;

const MONGO_URL = 'mongodb+srv://nasa-api:4qXAUlwuv5gquhgc@cluster0.zrn2qb2.mongodb.net/nasa?retryWrites=true&w=majority';

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('MongoDB Connection reay');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function startServer(){
    await mongoose.connect(MONGO_URL);
    await loadPlanetsData();

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
}

startServer();