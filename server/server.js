const express = require('express');
const bodyParser = require('body-parser');
//source in PG
const pg = require('pg');

const app = express();

// set up PG to connect with the DB!
const Pool = pg.Pool; // ALT entry: const { Pool } = require('pg.Pool)
const pool = new Pool({
    database: 'songs',
    host: 'localhost',
    port: '5432',
    max: 10,
    idleTimeoutMillis: 300000,
});

// .on looks familar, right? Just so we need the connecion sucreed. There are a million
// things that can go wrong!
// Handle CONNECTION events:
pool.on('connect', () =>{
    console.log('PostgreSQL connected! DoepWoot!');
});
// handle ERRORS from the DB:
pool.on('error', error => {
    console.log('Error with postgre pool', error);    
});

// Setup body parser - to translating request body into JSON
app.use( bodyParser.urlencoded({ extended: true }));
// app.use( bodyParser.json() );
app.use(express.static('server/public'));

// Routes would go here
let musicRouter = require('./routes/music_router');
app.use('/musicLibrary', musicRouter);


// Start express
const PORT = 5000;
app.listen(PORT, () => {
    console.log('up and running on port', PORT);
});

