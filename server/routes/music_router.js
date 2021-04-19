const express = require('express');
const router = express.Router();

//source in PG
const pg = require('pg');

// set up PG to connect with the DB!
const Pool = pg.Pool; // ALT entry: const { Pool } = require('pg.Pool)
const pool = new Pool({
    database: 'music_library',
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


let musicLibrary = [
    {
        rank: 355, 
        artist: 'Ke$ha', 
        track: 'Tik-Toc', 
        published: '1/1/2009'
    },
    {
        rank: 356, 
        artist: 'Gene Autry', 
        track: 'Rudolph, the Red-Nosed Reindeer', 
        published: '1/1/1949'
    },
    {
        rank: 357, 
        artist: 'Oasis', 
        track: 'Wonderwall', 
        published: '1/1/1996'
    }
];

router.get('/', (req, res) => {
    let queryText = 'SELECT * FROM songs;';
    pool.query(queryText)
        .then(dbResults => {
            res.send(dbResults.rows);
        })
        .catch((error) => {
            console.log(`Error! It broke trying to query ${queryText}`, error);
            res.sendStatus(500);
        })
});

router.post('/', (req, res) => {
    musicLibrary.push(req.body);
    res.sendStatus(200);
});

module.exports = router;