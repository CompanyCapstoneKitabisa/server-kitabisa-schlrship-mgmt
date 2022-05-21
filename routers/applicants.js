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
                    photo: applicantsDataDetail.photo,
                    name: applicantsDataDetail.name,
                    NIK: applicantsDataDetail.NIK,
                    provinsi: applicantsDataDetail.provinsi,
                    kotaKabupaten: applicantsDataDetail.kotaKabupaten,
                    kecamatan: applicantsDataDetail.kecamatan,
                    kelurahan: applicantsDataDetail.kelurahan,
                    alamat: applicantsDataDetail.alamat,
                    noPonsel: applicantsDataDetail.noPonsel,
                    email: applicantsDataDetail.email,
                    sosmedAcc: applicantsDataDetail.sosmedAcc,
                    university: applicantsDataDetail.university,
                    NIM: applicantsDataDetail.NIM,
                    jurusan: applicantsDataDetail.jurusan,
                    angkatan: applicantsDataDetail.angkatan,
                    IP: applicantsDataDetail.IP,
                    IPK: applicantsDataDetail.IPK,
                    pilihanBantuanBiaya: applicantsDataDetail.pilihanBantuanBiaya,
                    jumlahBiayaUKT: applicantsDataDetail.jumlahBiayaUKT,
                    deadlinePembayaran: applicantsDataDetail.deadlinePembayaran,
                    kebutuhan1: applicantsDataDetail.kebutuhan1,
                    biayaKebutuhan1: applicantsDataDetail.biayaKebutuhan1,
                    kebutuhan2: applicantsDataDetail.kebutuhan2,
                    biayaKebutuhan2: applicantsDataDetail.biayaKebutuhan2,
                    ceritaKondisi: applicantsDataDetail.ceritaKondisi,
                    ceritaSeberapaPenting: applicantsDataDetail.ceritaSeberapaPenting,
                    ceritaKegiatan: applicantsDataDetail.ceritaKegiatanAktif,
                    fotoKegiatan: applicantsDataDetail.fotoKegiatan,
                    fotoRumah: applicantsDataDetail.fotoRumah,
                    statusKepemilikanRumah: applicantsDataDetail.statusKepemilikanRumah,
                    buktiIPK: applicantsDataDetail.buktiIPK,
                    buktiIP: applicantsDataDetail.buktiIP,
                    KTM: applicantsDataDetail.KTM,
                    KTP: applicantsDataDetail.KTP,
                    lampiranDokumen: applicantsDataDetail.lampiranDokumen,
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
    const applicantsRef = db.collection('applicants')

    try{
        applicantsRef.doc(id).get().then((data) => {
            if(data.data() === undefined){
                res.status(200).send({
                    error: "true",
                    message: "Could not update status, applicant not found"
                })
            }else{
                if(lower_statusUpdate === 'rejected' || lower_statusUpdate === 'accepted' || lower_statusUpdate === ""){
                    applicantsRef.doc(id).update({status: lower_statusUpdate}).then(
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
            }
        })

    } catch (e) {
        res.status(500).send({
            message: "Internal server error"
        })
    }
})

module.exports = route