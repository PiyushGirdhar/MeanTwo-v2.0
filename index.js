// Initialising Node Modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');

// Calling the dependencies
const config = require('./config/database');
const authentication = require('./routes/authentication')(router);

// Assigning the port number
const port = 8080;

// Connecting with database
mongoose.connect(config.uri, { useMongoClient: true, promiseLibrary: global.Promise },  (err) => {
    if (err) {
        console.log('Database connection terminated because of ' +err);
    } else {
        console.log('Database connected ' + config.db);
    } 
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/authentication', authentication);
app.use(express.static(__dirname + '/client/dist'));

// Adding Routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname) + '/client/dist/index.html');
});

// Listening on the port
app.listen(port, (err) => {
    if (err) {
        console.log('Was not able to connect to the port ' + err);
    } else {
        console.log('Connected to the port ' + port);
    }
});