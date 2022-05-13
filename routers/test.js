const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

const route = express();

route.get('/', (req,res) => {
    res.send({message: 'hallo dari test'})
})

module.exports = route