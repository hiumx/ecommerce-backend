
const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const _SECONDS = 5000;

//count number of connection to db
const countConnect = () => {
    const numConnect = mongoose.connections.length;
    console.log(`Number of connection :: ${numConnect}`);
}

//check overload

const checkOverload = () => {
    setInterval(() => {
        const numConnect = mongoose.connections.length;   
        const numCores = os.cpus().length;
        const maxConnection = numCores * 5; //Suppose each cores acceptable 5 connection
        const memoryUsage = process.memoryUsage().rss;

        console.log(`Active connection :: ${numConnect}`);
        console.log(`Memory usage :: ${memoryUsage / 1024 / 1024} MB`);

        if(numConnect > maxConnection) {
            console.log('Connect overload');
        }
    }, _SECONDS);
}

module.exports = {
    countConnect,
    checkOverload
}