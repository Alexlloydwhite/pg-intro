const express = require('express');
const router = express.Router();
const pool = require('./pool_router');

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
                            VALUES ($1, $2, $3, $4)
                            RETURNING "id";`; // return ID since new record and don't have id beforehand. 
    pool.query(querytext, [req.body.rank, req.body.track, req.body.artist, req.body.published] )
        .then(result => {
            console.log('New record is is: ', result);
            // PQ result will always have an array ([]) for the .rows property
            // EVEN IF NOTHING IS RETURNED, there will be an array.
            // If you must validate, check that the array is not empty.
            res.sendStatus(201); // proper response code (in char's correct opinion.);
            // however res.sendStatus(200); acceptable if you must.. but don't
        })
        .catch(error => {
            console.log(`This didn't work. ${querytext}`, error);
            res.sendStatus(500); 
        });
});

// UPDATE
// put /musicLibrary/4 --- updates single song;
// req.body = { "direction": 'up'} 'up' or 'down' only options 
// any other value int eh bdoy will thorw a 500
router.put('/:id', (req, res) => {
    let songId = req.params.id;

    // get vote direction from the body of the req
    let direction = req.body.direction;

    let queryText = ``

    if (direction === 'up' ) {
        queryText = `UPDATE "songs" SET "rank"=rank+1 WHERE "id"=$1;`;
    } else if (direction === 'down') {
        queryText= `UPDATE "songs" SET "rank"=rank-1 WHERE "id"=$1;`;
    } else {
        res.sendStatus(500);
        return; // end the router operations ... 
    } 

    // Send the req > DB
    // only 1 query variable, but it still goes into an ARRAY!
    pool.query( queryText, [songId] )
        .then(response => {
            console.log('song edited');
            res.sendStatus(200);
        })
        // handles erors and send server error
        .catch(error => {
            console.log(`error making database query ${queryText}`, error);
            res.sendStatus(500);
        })
});

router.delete('/:id', (req,res) => {
    const recordToDelete = req.params.id;
    const queryText = `DELETE FROM "songs" WHERE id=$1;`;
    pool.query( queryText, [recordToDelete] )
        .then(result => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log('The delete deleted our delete:', error)
            res.sendStatus(500);
        });
});


module.exports = router;