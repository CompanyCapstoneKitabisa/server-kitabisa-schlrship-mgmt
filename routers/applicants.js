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