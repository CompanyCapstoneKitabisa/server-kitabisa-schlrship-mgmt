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
                    nim: applicantsDataDetail.NIM,
                    nik: applicantsDataDetail.NIK,
                    ajuanPenunjangPendidikan: applicantsDataDetail.ajuanPenunjangPendidikan,
                    alamat: applicantsDataDetail.alamat,
                    buktiIP: applicantsDataDetail.buktiIP,
                    buktiIPK: applicantsDataDetail.buktiIPK,
                    currIP: applicantsDataDetail.currIP,
                    deadlineUKT: applicantsDataDetail.deadlineUKT,
                    dokumenApplicant: applicantsDataDetail.dokumenApplicant,
                    email: applicantsDataDetail.email,
                    essayKegiatan: applicantsDataDetail.essayKegiatan,
                    essayKondisi: applicantsDataDetail.essayKondisi,
                    essayPenting: applicantsDataDetail.essayPenting,
                    fotoEssayKegiatan: applicantsDataDetail.fotoEssayKegiatan,
                    fotoRumah: applicantsDataDetail.fotoRumah,
                    jenisBantuan: applicantsDataDetail.jenisBantuan,
                    kecamatan: applicantsDataDetail.kecamatan,
                    kotaKabupaten: applicantsDataDetail.kotaKabupaten,
                    lamaranBeasiswa: applicantsDataDetail.lamaranBeasiswa,
                    name: applicantsDataDetail.name,
                    noTlp: applicantsDataDetail.noTlp,
                    proposalTunjanganBiaya: applicantsDataDetail.proposalTunjanganBiaya,
                    provinsi: applicantsDataDetail.provinsi,
                    rincianTunjangan: applicantsDataDetail.rincianTunjangan,
                    sosmedAcc: applicantsDataDetail.sosmedAcc,
                    status: applicantsDataDetail.status,
                    statusKepemilikanRumah: applicantsDataDetail.statusKepemilikanRumah,
                    submittedAt: applicantsDataDetail.submittedAt,
                    suratRekomendasiDosen: applicantsDataDetail.suratRekomendasiDosen,
                    token: applicantsDataDetail.token,
                    totalIPK: applicantsDataDetail.totalIPK,
                    uktDanSemester: applicantsDataDetail.uktDanSemester,
                    university: applicantsDataDetail.university
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