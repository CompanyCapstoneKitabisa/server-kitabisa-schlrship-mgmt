const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const userRoute = require('./routers/users.js');
const loginRoute = require('./routers/login.js');
const campaignRoute = require('./routers/campaign.js');

const app = express();
require('dotenv').config();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/users', userRoute);
app.use('/login', loginRoute);
// app.use('/campaigns', campaignRoute);


const server = app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});