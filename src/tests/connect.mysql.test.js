'use strict';

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'hiumx',
    password: '123456',
    port: 8833,
    database: 'shopDev'
});

pool.query('SELECT * FROM user', function(err, results) {
    if(err) throw err;
    console.log('Result query :: ', results);

    pool.end(err => { 
        if(err) throw err;
        console.log('Connection closed');
    })
})