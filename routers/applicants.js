const express = require('express');
const admin = require('firebase-admin');
const checkCampaign = require('../midWare/checkCampaign.js');
const dbconf = require('../config/firebase conf.js');
const auth = require('../midWare/auth.js');
const sortArray = require('sort-array')

const route = express();

const db = dbconf.firestore();

//API specific applicants detail
route.get('/',auth, (req,res) => {
    const id = req.query.id;
    var applicantsRef = db.collection('applicants');
    var success = 0;
    let fetchedData = {};

    applicantsRef.get().then((data) => {
        data.forEach((applicantsData) => {
            if(id === applicantsData.id){
                success = 1;
                var applicantsDataDetail = applicantsData.data();
                fetchedData = {
                    bioDiri: {
                        nama: applicantsDataDetail.bioDiri.namaLengkap,
                        provinsi: applicantsDataDetail.bioDiri.provinsi,
                        kotaKabupaten: applicantsDataDetail.bioDiri.kotaKabupaten,
                        alamat: applicantsDataDetail.bioDiri.alamat,
                        NIK: applicantsDataDetail.bioDiri.NIK,
                        fotoKTP: applicantsDataDetail.bioDiri.fotoKTP,
                        fotoDiri: applicantsDataDetail.bioDiri.fotoDiri,
                        sosmedAcc: applicantsDataDetail.bioDiri.sosmedAcc,
                        noTlp: applicantsDataDetail.bioDiri.noTlp
                    },
                    bioPendidikan: {
                        tingkatPendidikan: applicantsDataDetail.bioPendidikan.tingkatPendidikan,
                        jurusan: applicantsDataDetail.bioPendidikan.jurusan,
                        NIM: applicantsDataDetail.bioPendidikan.NIM,
                        NPSN: applicantsDataDetail.bioPendidikan.NPSN,
                        fotoKTM: applicantsDataDetail.bioPendidikan.fotoKTM,
                        fotoIPKAtauRapor: applicantsDataDetail.bioPendidikan.fotoIPKAtauRapor
                    },
                    pengajuanBantuan: {
                        kebutuhan: applicantsDataDetail.pengajuanBantuan.kebutuhan,
                        totalBiaya: applicantsDataDetail.pengajuanBantuan.totalBiaya,
                        fotoBuktiTunggakan: applicantsDataDetail.pengajuanBantuan.fotoBuktiTunggakan,
                        ceritaPenggunaanDana: applicantsDataDetail.pengajuanBantuan.ceritaPenggunaanDana,
                        kepemilikanRumah: applicantsDataDetail.pengajuanBantuan.kepemilikanRumah,
                        fotoRumah: applicantsDataDetail.pengajuanBantuan.fotoRumah
                    },
                    motivationLetter: {
                        ceritaLatarBelakang: applicantsDataDetail.motivationLetter.ceritaLatarBelakang,
                        ceritaPerjuangan: applicantsDataDetail.motivationLetter.ceritaPerjuangan,
                        ceritaPentingnyaBeasiswa: applicantsDataDetail.motivationLetter.ceritaPentingnyaBeasiswa,
                        ceritakegiatanYangDigeluti: applicantsDataDetail.motivationLetter.ceritaKegiatanYangDigeluti,
                        fotoBuktiKegiatan: applicantsDataDetail.motivationLetter.fotoBuktiKegiatan
                    },
                    scoreApplicant: {
                        total: applicantsDataDetail.scoreApplicant.total,
                        scoreRumah: applicantsDataDetail.scoreApplicant.scoreRumah,
                        scoreProvinsi: applicantsDataDetail.scoreApplicant.scoreProvinsi,
                        scorePerjuangan: applicantsDataDetail.scoreApplicant.scorePerjuangan,
                        scorePenting: applicantsDataDetail.scoreApplicant.scorePenting,
                        scoreNIK: applicantsDataDetail.scoreApplicant.scoreNIK,
                        scoreMedsos: applicantsDataDetail.scoreApplicant.scoreMedsos,
                        scoreLatarBelakang: applicantsDataDetail.scoreApplicant.scoreLatarBelakang,
                        scoreKota: applicantsDataDetail.scoreApplicant.scoreKota,
                        scoreKepemilikanRumah: applicantsDataDetail.scoreApplicant.scoreKepemilikanRumah,
                        scoreKegiatan: applicantsDataDetail.scoreApplicant.scoreKegiatan,
                        scoreDana: applicantsDataDetail.scoreApplicant.scoreDana
                    },
                    statusApplicant : applicantsDataDetail.statusApplicant,
                    statusData: applicantsDataDetail.statusData,
                    statusRumah: applicantsDataDetail.statusRumah,
                    lampiranTambahan: applicantsDataDetail.lampiranTambahan,
                    lembarPersetujuan: applicantsDataDetail.lembarPersetujuan,
                    misc: {
                        beasiswaTerdaftar: applicantsDataDetail.misc.beasiswaTerdaftar
                    },
                    reviewer: applicantsDataDetail.reviewer,
                    notes: applicantsDataDetail.notes
                }
            }

        })
        if(success === 1){
            res.status(200).send({
                error: false,
                message: "Data successfully fetched",
                fetchedData
            })
        } else if(success === 0){
            res.status(200).send({
                error: false,
                message: "Can't find applicant. Not found"
            })
        }
    })

})

//update specific applicant status
route.post('/:idApplicant/update',auth,  checkCampaign, (req,res) => {
    const campaignRef = db.collection('campaigns')
    const applicantRef = db.collection('applicants')
    const id = req.params.idApplicant

    const idCampaign = req.body.idCampaign
    const currStatus = req.body.currStatus
    const statusApplicant =  req.body.status
    const notes = req.body.notes
    const dataReviewer = req.body.reviewer

    //preparing all variable like /campaigns/:id/applicants/givePageNumber
    let counter = 0;

    let temp = [];

    let pendingCounter = 0;
    let pagePending = 0;

    let acceptedCounter = 0;
    let pageAccepted = 0;
    
    let rejectedCounter = 0;
    let pageRejected = 0;

    let onholdCounter = 0;
    let pageOnhold = 0;

    let lower_statusApplicant = '';

    let finalReportSA = 'Data not updated. No input for this data';
    let notesUpdate = 'Data not updated. No input for this data';

    const applicantsRef = db.collection('applicants')

    try{
        if(dataReviewer === undefined || dataReviewer === ""){
            res.status(409).send({
                error: true,
                message: "Failed to update, can't get reviewer"
            })
        } else {
            applicantsRef.doc(id).get().then((data) => {
                if(data.data() === undefined){
                    res.status(404).send({
                        error: true,
                        message: "Could not update status, applicant not found"
                    })
                }else{
                    if(statusApplicant !== undefined){
                        lower_statusApplicant = statusApplicant.toLowerCase()
                        if(lower_statusApplicant === 'rejected' || lower_statusApplicant === 'accepted' || lower_statusApplicant === "pending" || lower_statusApplicant === "onhold"){
                            applicantsRef.doc(id).update({statusApplicant: lower_statusApplicant})
                            finalReportSA = 'Data Updated';
                        }else{
                            finalReportSA ="Failed to update, wrong input data";
                        }

                        //logic for giving pageNumber based on their status (same like /campaigns/:id/applicants/givePageNumber)
                        let givePageNumber = async() => {
                            try{
                                campaignRef.doc(idCampaign).get().then((data) => {
                                    const detailDataApplicants = data.data().applicants;
                                    const status = data.data().pageNumber;
                                    if(detailDataApplicants === [] || detailDataApplicants === undefined){
                                        res.status(200).send({
                                            error: false,
                                            message: "Data not available yet"
                                        })
                                    } 
                                    detailDataApplicants.forEach((data) => {
                                        const length = temp.length
                                        if(length === 0){
                                            temp.push(data)
                                        } else if(data.score < temp[length-1].score){
                                            temp.push(data)
                                        } else {
                                            for(let i = 0; i < length; i++){
                                                if(data.score >= temp[i].score){
                                                    temp.splice(i,0,data)
                                                    i = length
                                                }
                                            }
                                        }
                                        counter++;
                    
                                        if(counter === detailDataApplicants.length){
                                            const process = async() => {
                                            for(let i = 0; i < temp.length; i++){
                                                    await applicantRef.doc(temp[i].id).get().then((data) => {
                                                        console.log(data.data().statusApplicant)
                                                        if(data.data().statusApplicant === "pending"){
                                                            if(pendingCounter % 10 === 0){
                                                                pagePending++;
                                                            }
                                                            temp[i].page = pagePending;
                                                            pendingCounter++;
                    
                                                        } else if(data.data().statusApplicant === "accepted"){
                                                            if(acceptedCounter % 10 === 0){
                                                                pageAccepted++;
                                                            }
                                                            temp[i].page = pageAccepted;
                                                            acceptedCounter++;
                                                        }else if(data.data().statusApplicant === "rejected"){
                                                            if(rejectedCounter % 10 === 0){
                                                                pageRejected++;
                                                            }
                                                            temp[i].page = pageRejected;
                                                            rejectedCounter++;
                                                        }else if(data.data().statusApplicant === "onhold"){
                                                            if(onholdCounter % 10 === 0){
                                                                pageOnhold++;
                                                            }
                                                            temp[i].page = pageOnhold;
                                                            onholdCounter++;
                                                        }
                                                    })
                                                }
                                            }
                                            
                                            const main = async() => {
                                                await process();
                                                campaignRef.doc(idCampaign).update({applicants: temp})
                                            }
                    
                                            main();
                                        }
                                    })
                                })
                            } catch(e) {
                                res.status(500).send({
                                    error: true,
                                    message: "Internal Server error"
                                })    
                            }
                        }

                        //only executed if currStatus is different than the new status gona applied
                        if(currStatus !== statusApplicant){
                            givePageNumber();
                        }
                    }

                    if(notes !== undefined){
                        applicantsRef.doc(id).update({notes: notes})
                        notesUpdate = "notes updated"
                    }

                    applicantsRef.doc(id).update({reviewer: dataReviewer})
                }
    
                res.status(200).send({
                    error: false,
                    message: {
                        statusApplicant: finalReportSA,
                        notes: notesUpdate
                    }
                })
            })
        }
    } catch (e) {
        res.status(500).send({
            message: "Internal server error"
        })
    }
})


module.exports = route