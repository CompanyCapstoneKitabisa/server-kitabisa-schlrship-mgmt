const express = require('express');
const admin = require('firebase-admin');
const dbconf = require('./firebase conf.js');

const route = express();

const db = dbconf.firestore();

//API to get all available campaigns
route.get('/', (req,res) => {
    const campaignRef = db.collection('campaigns');
    let campaignList = [];

    try{
        campaignRef.get().then((data) => {
            data.forEach((campaignData) => {
                var campaignDataDetails = campaignData.data()
                var fetchedData = {
                    id: campaignData.id,
                    name: campaignDataDetails.name,
                    penggalangDana: campaignDataDetails.penggalangDana,
                    photoUrl: campaignDataDetails.photoUrl
                }

                campaignList.push(fetchedData)
            })
            
            if(campaignList.length !== 0){
                res.status(200).send({
                    error: false,
                    message: "Data successfully fetched",
                    listCampaign: campaignList
                })
            } else if(campaignList.length === 0){
                res.status(200).send({
                    error: false,
                    message: "No available data",
                })
            }
        }) 
    } catch (e) {
        res.status(500).send({
            message: "Internal server error, failed to fetch data"
        })
    }
})

//get specific scholarship program details
route.get('/:id', (req,res) => {
    const id = req.params.id
    const campaignRef = db.collection('campaigns');
    const applicantRef = db.collection('applicants');
    let listApplicants = [];
    let counterRejected = 0;
    let counterAccepted = 0;
    let counter = 0;

    try{
        campaignRef.doc(`${id}`).get().then((data) => {
            const detailCampaignData = data.data().applicants
            const campaignData = data.data();
            detailCampaignData.forEach((d) => {
                console.log(d)
                applicantRef.doc(`${d}`).get().then((userData) => {
                    const userDataDetails = userData.data()

                    if(userDataDetails.status === 'rejected'){
                        counterRejected++
                    }else if(userDataDetails.status === 'accepted'){
                        counterAccepted++
                    }

                    counter++

                     //if it's already the last data, then send it
                     if(counter === detailCampaignData.length){
                        const sendData = {
                            name: campaignData.name,
                            penggalangDana: campaignData.penggalangDana,
                            photoUrl: campaignData.photoUrl,
                            applicantsCount: detailCampaignData.length,
                            acceptedApplicants: counterAccepted,
                            rejectedApplicants: counterRejected
                        }

                        res.status(200).send({
                            error: false,
                            message: "Campaign details fetched",
                            Data: sendData
                        })
                        
                    }


                })
            })
        })
    }catch(e){

    }
})

//getting all applicants in a specific scholarship program
route.get('/:id/applicants', (req,res) => {
    const id = req.params.id;
    const campaignRef = db.collection('campaigns');
    const applicantRef = db.collection('applicants');
    let listApplicants = [];
    let counter = 0;

    try{
        campaignRef.doc(`${id}`).get().then((data) => {
            if(id === data.id){
                const applicantsInCampaign = data.data().applicants
                applicantsInCampaign.forEach((d) => {
                    applicantRef.doc(d).get().then((userData) => {
                        const userDataDetails = userData.data()
                        
                       const dataSend = {
                            id: userData.id,
                            name: userDataDetails.name,
                            university: userDataDetails.university,
                            rank: userDataDetails.rank,
                            rating: userDataDetails.rating,
                            status: userDataDetails.status
                        }  

                        counter++
                        listApplicants.push(dataSend)

                        //if it's already the last data, then send it
                        if(counter === applicantsInCampaign.length){
                            res.status(200).send({
                                error: false,
                                message: "All applicants successfully fetched",
                                listApplicants
                            })
                        }
                    })
                })
            }
        })
    } catch (e) {
        console.log('error')
    }
})

//getting all rejected applicants from specific scholarship program
route.get('/:id/rejected', (req,res) => {
    const id = req.params.id;
    const campaignRef = db.collection('campaigns');
    const applicantRef = db.collection('applicants');
    let listApplicants = [];
    let counter = 0;

    try{
        campaignRef.doc(`${id}`).get().then((data) => {
            if(id === data.id){
                const applicantsInCampaign = data.data().applicants
                applicantsInCampaign.forEach((d) => {
                    applicantRef.doc(d).get().then((userData) => {
                        const userDataDetails = userData.data()
                        
                        if(userDataDetails.status === 'rejected'){
                            const dataSend = {
                                id: userData.id,
                                name: userDataDetails.name,
                                university: userDataDetails.university,
                                rank: userDataDetails.rank,
                                rating: userDataDetails.rating,
                                status: userDataDetails.status
                            }  
                            listApplicants.push(dataSend)
                        }
                        counter++

                        //if it's already the last data, then send it
                        if(counter === applicantsInCampaign.length){
                            if(listApplicants.length === 0){
                                res.status(200).send({
                                    error: false,
                                    message: "No rejected applicants",
                                })
                            } else {
                                res.status(200).send({
                                    error: false,
                                    message: "Fetched all rejected applicants",
                                    listApplicants
                                })
                            }
                        }

                    })
                })
            }
        })
    } catch (e) {
        console.log('error')
    }
})

//getting all accepted applicants from specific scholarship program
route.get('/:id/accepted', (req,res) => {
    const id = req.params.id;
    const campaignRef = db.collection('campaigns');
    const applicantRef = db.collection('applicants');
    let listApplicants = [];
    let counter = 0;

    try{
        campaignRef.doc(`${id}`).get().then((data) => {
            if(id === data.id){
                const applicantsInCampaign = data.data().applicants
                applicantsInCampaign.forEach((d) => {
                    applicantRef.doc(d).get().then((userData) => {
                        const userDataDetails = userData.data()
                        
                        if(userDataDetails.status === 'accepted'){
                            const dataSend = {
                                id: userData.id,
                                name: userDataDetails.name,
                                university: userDataDetails.university,
                                rank: userDataDetails.rank,
                                rating: userDataDetails.rating,
                                status: userDataDetails.status
                            }  
                            listApplicants.push(dataSend)
                        }
                        counter++

                        //if it's already the last data, then send it
                        if(counter === applicantsInCampaign.length){
                            if(listApplicants.length === 0){
                                res.status(200).send({
                                    error: false,
                                    message: "No rejected applicants",
                                })
                            } else {
                                res.status(200).send({
                                    error: false,
                                    message: "Fetched all rejected applicants",
                                    listApplicants
                                })
                            }
                        }

                    })
                })
            }
        })
    } catch (e) {
        console.log('error')
    }
})

module.exports = route