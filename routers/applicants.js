const express = require('express');
const admin = require('firebase-admin');
const dbconf = require('./firebase conf.js');

const route = express();

const db = dbconf.firestore();

//API specific applicants detail
route.get('/', (req,res) => {
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
                    id: id,
                    name: applicantsDataDetail.name,
                    photoUrl: applicantsDataDetail.photoUrl,
                    email: applicantsDataDetail.email,
                    university: applicantsDataDetail.university,
                    jurusan: applicantsDataDetail.jurusan,
                    angkatan: applicantsDataDetail.angkatan,
                    provinsi: applicantsDataDetail.provinsi,
                    kota: applicantsDataDetail.kota,
                    kecamatan: applicantsDataDetail.kecamatan,
                    kelurahan: applicantsDataDetail.kelurahan,
                    alamat: applicantsDataDetail.alamat,
                    nim: applicantsDataDetail.nim,
                    nik: applicantsDataDetail.nik,
                    phoneNumber: applicantsDataDetail.phoneNumber,
                    sosmedAcc: applicantsDataDetail.sosmedAcc,
                    status: applicantsDataDetail.status,
                    essay: applicantsDataDetail.essay,
                    jenisBantuan: applicantsDataDetail.jenisBantuan,
                    jumlahBiaya: applicantsDataDetail.jumlahBiaya,
                    deadlinePembayaran: applicantsDataDetail.deadlinePembayaran,
                    kebutuhanPenunjang: applicantsDataDetail.kebutuhanPenunjang,
                    rincianBiayaPenunjang: applicantsDataDetail.rincianBiayaPenunjang,
                    images: applicantsDataDetail.images
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
                message: "Data not found"
            })
        }
    })

})

//Search applicant by name
route.get('/search', (req,res) => {
    const applicantsRef = db.collection('applicants')

    const name = req.body.name
    const lower_name = name.toLowerCase()

    let counter = 0;
    let searchResult = [];

    try{
        applicantsRef.get().then((data) => {
            data.forEach((userData) => {
                const userDataDetails = userData.data()
                const user_name = userDataDetails.name
                let lower_user_name = user_name.toLowerCase()
                if(lower_user_name.includes(lower_name)){
                    let Datafound = {
                        id: userData.id,
                        name: userDataDetails.name,
                        university: userDataDetails.university,
                        rank: userDataDetails.rank,
                        score: userDataDetails.score,
                        status: userDataDetails.status
                    }
                    searchResult.push(Datafound)
                }

                counter++

                if(counter === data.size){
                    res.status(200).send({
                        error: false,
                        message: "Search result",
                        listApplicants: searchResult
                    })
                }
            })
        })
    } catch (e){
        res.status(500).send({
            message: "Internal server error"
        })
    }


})

//update specific applicant status
route.post('/:id/update', (req,res) => {
    const id = req.params.id
    const statusUpdate = req.body.status
    const lower_statusUpdate = statusUpdate.toLowerCase()

    if(lower_statusUpdate === 'rejected' || lower_statusUpdate === 'accepted' || lower_statusUpdate === ""){
        const applicantsRef = db.collection('applicants').doc(id).update({status: lower_statusUpdate}).then(
            res.status(200).send({
                error: false,
                message: "Status updated"
            })
        )
    } else {
        res.status(200).send({
            error: true,
            message: "Wrong Data"
        })
    }
})

module.exports = route