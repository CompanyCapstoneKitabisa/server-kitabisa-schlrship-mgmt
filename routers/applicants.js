const express = require('express');
const admin = require('firebase-admin');
const dbconf = require('../config/firebase conf.js');
const auth = require('../midWare/auth.js');

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
                    motivationLater: {
                        ceritaLatarBelakang: applicantsDataDetail.motivationLater.ceritaLatarBelakang,
                        ceritaPerjuangan: applicantsDataDetail.motivationLater.ceritaPerjuangan,
                        ceritaPentingnyaBeasiswa: applicantsDataDetail.motivationLater.ceritaPentingnyaBeasiswa,
                        ceritakegiatanYangDigeluti: applicantsDataDetail.motivationLater.ceritakegiatanYangDigeluti,
                        fotoBuktiKegiatan: applicantsDataDetail.motivationLater.fotoBuktiKegiatan
                    },
                    statusApplicant : applicantsDataDetail.statusApplicant,
                    statusData: applicantsDataDetail.statusData,
                    statusRumah: applicantsDataDetail.statusRumah,
                    lampiranTambahan: applicantsDataDetail.lampiranTambahan,
                    lembarPersetujuan: applicantsDataDetail.lembarPersetujuan,
                    misc: {
                        beasiswaTerdaftar: applicantsDataDetail.misc.beasiswaTerdaftar
                    },
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
route.post('/:id/updateStatus', auth, (req,res) => {
    const id = req.params.id

    const statusApplicant =  req.body.statusApplicant
    const statusData = req.body.statusData
    const statusRumah = req.body.statusRumah

    let lower_statusApplicant = '';
    let lower_statusRumah = '';
    let lower_statusData = '';

    let finalReportSA = 'Data not updated. No input for this data';
    let finalReportSD = 'Data not updated. No input for this data';
    let finalReportR = 'Data not updated. No input for this data';

    const applicantsRef = db.collection('applicants')

    try{
        applicantsRef.doc(id).get().then((data) => {
            if(data.data() === undefined){
                res.status(200).send({
                    error: "true",
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
                }

                if(statusData !== undefined){
                    lower_statusData = statusData.toLowerCase()
                    if(lower_statusData === 'rejected' || lower_statusData === 'accepted' || lower_statusData === "pending" || lower_statusData === "onhold"){
                        applicantsRef.doc(id).update({statusData: lower_statusData})
                        finalReportSD = 'Data Updated';
                    }else{
                        finalReportSD ="Failed to update, wrong input data";
                    }
                }

                if(statusRumah !== undefined){
                    lower_statusRumah = statusRumah.toLowerCase()
                    if(lower_statusRumah === 'rejected' || lower_statusRumah === 'accepted' || lower_statusRumah === "pending" || lower_statusRumah === "onhold"){
                        applicantsRef.doc(id).update({statusRumah: lower_statusRumah})
                        finalReportR = 'Data Updated';
                    }else{
                        finalReportR = "Failed to update, wrong input data";
                    }
                }
            }

            res.status(200).send({
                error: false,
                message: {
                    statusApplicant: finalReportSA,
                    statusData: finalReportSD,
                    statusRumah: finalReportR
                }
            })
        })
    } catch (e) {
        res.status(500).send({
            message: "Internal server error"
        })
    }
})

route.get('/:id/notes', auth, (req,res) => {
    const id = req.params.id;
    const applicantsRef = db.collection('applicants');

    try{
        applicantsRef.doc(id).get().then((data) => {
            if(data.data() === undefined){
                res.status(200).send({
                    message: `Can't found applicant with id ${id}`
                })
            } else{
                res.status(200).send({
                    message: "Data fetched",
                    data: {
                        name: data.data().name,
                        notes: data.data().notes
                    }
                })
            }
        })
    } catch (e) {
        res.status(500).send({
            message: "Internal server error",
            error: e
        })
    }
})

route.post('/:id/notes',auth, (req,res) => {
    const id = req.params.id;
    const new_notes = req.body.notes;
    const applicantsRef = db.collection('applicants');

    try{
        applicantsRef.doc(id).get().then((data) => {
            if(data.data() === undefined){
                res.status(200).send({
                    message: `Can't found applicant with id ${id}` 
                })
            } else{
                applicantsRef.doc(id).update({notes: new_notes}).then(
                    res.status(200).send({
                        message: "Notes updated"
                    })
                )
            }
        })
    } catch (e) {
        res.status(500).send({
            message: "Internal server error",
            error: e
        })
    }
})

module.exports = route