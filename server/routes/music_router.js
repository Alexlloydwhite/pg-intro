const express = require('express');
const router = express.Router();
const pool = require('./pool_router');

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