const pg = require('pg');
const Pool = pg.Pool;

// set up PG to connect with the DB!
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

module.exports = pool;