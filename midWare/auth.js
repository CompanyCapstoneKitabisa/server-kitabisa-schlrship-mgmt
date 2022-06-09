const dbconf = require('../config/firebase conf.js');
const jwt_decode = require('jwt-decode');

const db = dbconf.firestore();

function auth (req,res,next){
    const token = req.header('authToken');
    try{
        if(!token){
            res.status(403).send({
                message: "UNAUTHORIZE ACCESS!"
            })
        } else {
            //check if token still valid or already expired
            const token_decode = jwt_decode(token)
            const JWTTime = new Date(token_decode.exp * 1000)
            const localTime = new Date()
            if((localTime - JWTTime) > -1){ //if token expired
                res.status(403).send({
                    error: true,
                    message: "EXPIRED TOKEN"
                })
            } else{ //if token not expired
                if(dbconf.auth().verifyIdToken(token, true)){
                    next();
                } else {
                    res.status(403).send({
                        error: true,
                        message: "UNAUTHORIZE ACCESS"
                    })
                }
            }
        }
    }catch(e){
        res.send(e)
    }
}

module.exports = auth;