import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (_q, res) => {
    res.send('Oi');
});

app.listen(3000, () => console.log('Server is running at http://localhost:3000. 🚀'));
