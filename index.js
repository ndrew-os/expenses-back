const app = require('./src/app');

const port = 3040;

app.listen(port, () => {
    console.log('Listening on port', port);
});

