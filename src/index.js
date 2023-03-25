import express from 'express';

const port = process.env.port || 3000;
const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Hi from Server</h1>');
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
