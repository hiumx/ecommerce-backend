const app = require('./app');

const PORT = process.env.PORT || 3456;

const server = app.listen(PORT, () => {
    console.log(`Server running at PORT: ${PORT}`);
});

// process.on('SIGINT', () => {
//     server.close(() => {
//         console.log('Server stop running');
//     })
// })