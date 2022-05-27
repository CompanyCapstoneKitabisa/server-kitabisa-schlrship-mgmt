const axios = require('axios');

const dotenv = require('dotenv');

require('dotenv').config();

async function score(dataRecieved) {
    //Send to flask all data needed for prediction
    let data = await axios.post(process.env.ADDRESS_ML, {
         headers: {
            "Content-Type": "application/json" 
        },
        data: dataRecieved
    }) //getting the response from flask
    .catch((error) => {
        return error
    })

    return data.data
}

module.exports = score