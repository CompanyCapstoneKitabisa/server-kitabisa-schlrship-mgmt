const express = require('express');
const cors = require('cors');

const userRoute = require('./routers/users.js');
const loginRoute = require('./routers/login.js');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {res.send({message: "Hello world!"})})

// app.use('/users', userRoute);
app.use('/login', loginRoute);


const server = app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});