const express = require('express');
const admin = require('firebase-admin');
const dbconf = require('../config/firebase conf.js');
const bcrypt = require('bcrypt');

const route = express();

const db = dbconf.firestore();

route.post('/', (req,res) => {
    var usersRef = db.collection('users');
    const dataLogin = {
        email: req.body.email,
        password: req.body.password
    };
    var success = 0;
    let dataUserLogin = {};

    try{
        usersRef.get().then((data) => {
            data.forEach((userDoc) => {
                var userDocData = userDoc.data()
                if(userDocData.email === dataLogin.email && bcrypt.compareSync(dataLogin.password, userDocData.password)){
                    success = success + 1;
                    dataUserLogin = {
                        id: userDoc.id,
                        firstName: userDocData.firstName,
                        lastName: userDocData.lastName
                    }
                }
            })
            if(success === 1){
                res.status(200).send({
                    message: 'Berhasil login',
                    dataUserLogin
                })
            }else if(success === 0){
                res.status(404).send({
                    message: 'Gagal login'
                })
            }
        })
    } catch (e) {
        res.status(500).send({message: 'Internal server error'})
    }
})

module.exports = route