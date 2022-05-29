const dbconf = require('../config/firebase conf.js');

const db = dbconf.firestore();

function auth (req,res,next){
    const token = req.header('authToken');
    if(!token){
        res.status(403).send({
            message: "UNAUTHORIZE ACCESS!"
        })
    } else {
        try{
            if(dbconf.auth().verifyIdToken(token, true)){
                next();
            } else {
                res.status(403).send({
                    message: "UNAUTHORIZE ACCESS!"
                })
            }
        } catch(e) {
            res.status(500).send({
                message: "Internal server error"
            })
        }
    }
}

module.exports = auth;