const dbconf = require('../config/firebase conf.js');

const db = dbconf.firestore();

function check (req,res,next){
    const idCampaign = req.params.id;
    const campaignRef = db.collection('campaigns');
    let available = 0;

    try{
       campaignRef.get().then((data) => {
           data.forEach((campaign) => {
                if(idCampaign === campaign.id && campaign.data().applicants !== undefined){
                    available = 1
                }
           })

           if(available === 1){
               next();
           }else if(available === 0){
               res.status(200).send({
                   message: "Failed to fetch data"
               })
           }
       })
    }catch(err){
        res.status(400).send({
            message: "Internal server error"
        });
    }
}

module.exports = check;