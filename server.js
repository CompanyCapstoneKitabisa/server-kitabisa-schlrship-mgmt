const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const userRoute = require('./routers/users.js');
const loginRoute = require('./routers/login.js');
const testRoute = require('./routers/test.js');

const app = express();
require('dotenv').config();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {res.send({message: "Hello world!"})})

app.use('/users', userRoute);
app.use('/login', loginRoute);
app.use('/test', testRoute);


const server = app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});