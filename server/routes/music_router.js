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
    const song = {
        artist: req.body.artist,
        track: req.body.track,
        rank: req.body.rank,
        published: req.body.published,
    };
    // ensure the data is coming in from the front end!!
    // console.log(song);

    // create INSERT query fro POSTING a new record to the DB:
    const querytext = `INSERT INTO "songs" ("rank", "track", "artist", "published")
                            VALUES ('${song.rank}', '${song.track}', '${song.artist}', '${song.published}')
                            RETURNING "id";`; // return ID since new record and don't have id beforehand. 
    pool.query(querytext)
        .then(result => {
            console.log('New record is is: ', result);
            res.sendStatus(201); // proper response code (in char's correct opinion.);
            // however res.sendStatus(200); acceptable if you must.. but don't
        })
        .catch(err => {
            console.log(`This didn't work. ${querytext}`, error);
            res.sendStatus(500); 
        });
});

module.exports = router;