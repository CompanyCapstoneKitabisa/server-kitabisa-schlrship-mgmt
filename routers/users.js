const express = require('express');
const admin = require('firebase-admin');
const dbconf = require('./firebase conf.js');
const bcrypt = require('bcrypt');

const route = express();
var db = dbconf.firestore();

//endpoint to get specific user using their id
route.get('/', (req,res) => {
    var usersRef = db.collection('users');
    let dataUser = {};
    let success = 0;

    try{
        usersRef.get().then((data) => {
            data.forEach((userDoc) => {
                var userDocData = userDoc.data()
                if(userDoc.id === req.query.id){
                    success = 1;
                    dataUser = {
                        id: userDoc.id,
                        firstName: userDocData.firstName,
                        lastName: userDocData.lastName,
                        email: userDocData.email
                    }
                }
            })
            if(success === 1){
                res.status(200).send({
                    message: 'User berhasil ditemukan',
                    dataUser
                })
            }else if(success === 0){
                res.status(404).send({
                    message: 'User tidak ditemukan'
                })
            }
        })
    } catch (e) {
        res.status(500).send({e})
    }
})


//endpoint for registering new user
route.post('/', (req,res) => {
    //hashing the password
    const hash = bcrypt.hashSync(req.body.password, 10);

    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash
    };
    let success = 1;
    
    try{
        var usersRef = db.collection('users');
        usersRef.get().then((data) => {
            data.forEach((userDoc) => {
                var userDocData = userDoc.data()
                if(userDocData.email === userData.email){
                    success = 0;
                }
            })
        if(success === 1){
            db.collection('users').add(userData);
            res.status(200).send({message: 'User berhasil ditambahkan'});
        }else if(success === 0){
            res.status(500).send({message: 'Gagal mendaftar. email sudah terdaftar'})
        }
        })
    }catch(error){
        res.status(500).send({error, message: "User gagal ditambahkan"})
    }
})

module.exports = route