const express = require('express');
const admin = require('firebase-admin');
const dbconf = require('./firebase conf.js');
const checkCampaign = require('../midWare/checkCampaign.js');

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
route.get('/:id',checkCampaign, (req,res) => {
    const id = req.params.id
    const campaignRef = db.collection('campaigns');
    const applicantRef = db.collection('applicants');
    let listApplicants = [];
    let counterRejected = 0;
    let counterAccepted = 0;
    let applicantsNumber = 0;
    let counter = 0;

    try{
        campaignRef.doc(id).get().then((data) => {
            const detailCampaignData = data.data().applicants
            const campaignData = data.data();
            
            //if there's no applicants at all
            if(detailCampaignData.length < 1){
                const sendData = {
                    name: campaignData.name,
                    penggalangDana: campaignData.penggalangDana,
                    photoUrl: campaignData.photoUrl,
                    applicantsCount: 0,
                    acceptedApplicants: 0,
                    rejectedApplicants: 0
                }
                res.status(200).send({
                    error: false,
                    message: "Campaign details fetched",
                    Data: sendData
                })
            }

            //if there's at least 1 applicant
            detailCampaignData.forEach((d) => {
                applicantRef.doc(d).get().then((userData) => {
                    const userDataDetails = userData.data()

                    //just in case if one of the applicants not found in db
                    if(userDataDetails === undefined){
                        res.status(404).send({
                            message: `Failed to fetch applicants with id ${d}. not registered in db.`
                        })
                    }
                    //else if applicants found in db
                    else{
                        if(userDataDetails.status === 'rejected'){
                            counterRejected++
                            applicantsNumber++
                        }else if(userDataDetails.status === 'accepted'){
                            counterAccepted++
                            applicantsNumber++
                        }
                        
                        counter++
    
                         //if it's already the last data, then send it
                         if(counter === detailCampaignData.length){
                            const sendData = {
                                name: campaignData.name,
                                penggalangDana: campaignData.penggalangDana,
                                photoUrl: campaignData.photoUrl,
                                applicantsCount: applicantsNumber,
                                acceptedApplicants: counterAccepted,
                                rejectedApplicants: counterRejected
                            }
    
                            res.status(200).send({
                                error: false,
                                message: "Campaign details fetched",
                                Data: sendData
                            })
                            
                        }
                    }
                })
            })
        })
    }catch(e){
        res.status(500).seng({
            message: "Internal server error"
        })
    }
})

//getting all applicants in a specific scholarship program
route.get('/:id/applicants',checkCampaign, (req,res) => {
    const id = req.params.id;
    const campaignRef = db.collection('campaigns');
    const applicantRef = db.collection('applicants');
    let listApplicants = [];
    let counter = 0;
    let available = 0;

    try{
        campaignRef.doc(id).get().then((data) => {
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
                                    campaign: data.data().name,
                                    listApplicants
                                })
                            }
                        })
                    })
                }
        })
    } catch (e) {
        res.status(500).send({
            message: "Internal server error"
        })
    }
})

//Search applicant by name
route.get('/:id/applicants/:applicantsName',checkCampaign, (req,res) => {
    const applicantsRef = db.collection('applicants')
    const campaignRef = db.collection('campaigns')

    const idCampaign = req.params.id
    const name = req.params.applicantsName
    const lower_name = name.toLowerCase()

    let counter = 0;
    let searchResult = [];

    try{
        campaignRef.doc(idCampaign).get().then((data) => {
            const campaignDataDetails = data.data()
            const listApplicantsFound = campaignDataDetails.applicants

            listApplicantsFound.forEach((LAF) => {
                applicantsRef.doc(LAF).get().then((dataApplicant) => {
                    const userDataDetails = dataApplicant.data()
                    const user_name = userDataDetails.name
                    let lower_user_name = user_name.toLowerCase()
                    if(lower_user_name.includes(lower_name)){
                        let Datafound = {
                            id: dataApplicant.id,
                            name: userDataDetails.name,
                            university: userDataDetails.university,
                            rank: userDataDetails.rank,
                            score: userDataDetails.score,
                            status: userDataDetails.status
                        }
                        searchResult.push(Datafound)
                    }
    
                    counter++
    
                    if(counter === listApplicantsFound.length){
                        res.status(200).send({
                            error: false,
                            message: "Search result",
                            campaign: campaignDataDetails.name,
                            listApplicants: searchResult
                        })
                    }
                })
            })
        })
    } catch (e){
        res.status(500).send({
            message: "Internal server error"
        })
    }
})

//getting all rejected applicants from specific scholarship program
route.get('/:id/rejected',checkCampaign, (req,res) => {
    const id = req.params.id;
    const campaignRef = db.collection('campaigns');
    const applicantRef = db.collection('applicants');
    let listApplicants = [];
    let counter = 0;

    try{
        campaignRef.doc(id).get().then((data) => {
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
                                    campaign: data.data().name,
                                    message: "No rejected applicants",
                                })
                            } else {
                                res.status(200).send({
                                    error: false,
                                    message: "Fetched all rejected applicants",
                                    campaign: data.data().name,
                                    listApplicants
                                })
                            }
                        }
                    })
                })
            }
        })
    } catch (e) {
        res.status(500).send({
            message: "Internal server error"
        })
    }
})

//getting all accepted applicants from specific scholarship program
route.get('/:id/accepted',checkCampaign, (req,res) => {
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
                                    campaign: data.data().name,
                                    message: "No rejected applicants",
                                })
                            } else {
                                res.status(200).send({
                                    error: false,
                                    message: "Fetched all rejected applicants",
                                    campaign: data.data().name,
                                    listApplicants
                                })
                            }
                        }
                    })
                })
            }
        })
    } catch (e) {
        res.status(500).send({
            message: "Internal server error"
        })
    }
})

module.exports = route