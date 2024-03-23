'use strict';

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'hiumx',
    password: '123456',
    port: 8833,
    database: 'shopDev'
});

const batchSize = 100_000;
const totalSize = 10_000_000;

let currentId = 1;
console.time('------TIME------');
const insertBatch = async () => {
    const values = [];

    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${i}`;
        const age = i;
        values.push([name, age]);
        currentId++;
    }

    if(!values.length) {
        pool.end(err => {
            if(err) 
                console.log('Error when insert record');
            console.timeEnd();
            console.log('Connection closed successfully');
        });
        return;
    }

    const sql = 'INSERT INTO user (name, age) VALUES ?';

    pool.query(sql, [values], async (err, result) => {
        if(err) throw err;
        console.log(`Inserted ${result.affectedRows} records`);
        await insertBatch();
    })
}

insertBatch();
console.time('------TIME-------');

// pool.query('SELECT * FROM user', function(err, results) {
//     if(err) throw err;
//     console.log('Result query :: ', results);

//     pool.end(err => { 
//         if(err) throw err;
//         console.log('Connection closed');
//     })
// })