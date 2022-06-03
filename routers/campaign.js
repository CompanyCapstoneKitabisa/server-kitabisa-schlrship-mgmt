const express = require('express');
const admin = require('firebase-admin');
const dbconf = require('../config/firebase conf.js');
const checkCampaign = require('../midWare/checkCampaign.js');
const auth = require('../midWare/auth.js');
const score = require('./getApplicantScore');
const dotenv = require('dotenv');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { default: axios } = require('axios');

require('dotenv').config();

const route = express();

const db = dbconf.firestore();

//To read data from GSheet and send all data needed for prediction to flask. finnally input the data readed to database
route.get('/:id/applicants/processData',auth, checkCampaign, (req,res) => {
    const campaignRef = db.collection('campaigns');
    const applicantRef = db.collection('applicants');
    const idCampaign = req.params.id;
    let idGSheet = '';
    let scoreApplicant = '';
    let page = 1;

    let processApplicantData = async() => {
        await campaignRef.doc(idCampaign).get().then((data) => {
            idGSheet = data.data().idGSheet
        })

        const doc = new GoogleSpreadsheet(idGSheet);

        doc.useServiceAccountAuth({
            client_email: process.env.GSHEET_CLIENT_EMAIL,
            private_key: process.env.GSHEET_PRIVATE_KEY.replace(/\\n/g, '\n')
        });

        await doc.loadInfo()

        const sheet = doc.sheetsByIndex[0];
        
        const rows = await sheet.getRows();
        for(let i = 0; i < rows.length; i++){
            dataUser = {
                "Provinsi": rows[i]['Provinsi'],
                "Kota/Kabupaten": rows[i]['Kabupaten / Kota'],
                "Medsos": rows[i]['Akun Sosial Media'],
                "Status Rumah":  rows[i]['Kepemilikan Rumah'],
                "NIK": rows[i]['Nomor KTP (NIK)'],
                "Foto KTP": rows[i]['Foto KTP'],
                "Foto Rumah": rows[i]['Foto Rumah Jelas'],
                "Cerita Penggunaan Dana": rows[i]['Cerita rencana penggunaan dana'],
                "Cerita Latar Belakang": rows[i]['Cerita Latar Belakang Diri & Keluarga'],
                "Cerita Perjuangan": rows[i]['Cerita Perjuangan Melanjutkan Pendidikan'],
                "Beasiswa Penting": rows[i]['Cerita Pentingnya Beasiswa Ini untuk Anda'],
                "Cerita Kegiatan": rows[i]['Cerita Mengenai Kegiatan yang Digeluti Saat Ini di Sekolah/Kuliah'],
            }
    
            //sending the data to flask server
            scoreApplicant = await score(dataUser)

            //prepare the data to be sent to DB
            const dataInputUser = {
                bioDiri: { 
                    NIK: rows[i]['Nomor KTP (NIK)'],
                    alamat: rows[i]['Alamat Lengkap'],
                    fotoDiri: rows[i]['Foto Diri'],
                    fotoKTP: rows[i]['Foto KTP'],
                    kotaKabupaten: rows[i]['Kabupaten / Kota'],
                    namaLengkap: rows[i]['Nama lengkap'],
                    noTlp: rows[i]['Nomor Telepon (Whatsapp) Aktif'],
                    provinsi: rows[i]['Provinsi'],
                    sosmedAcc: rows[i]['Akun Sosial Media']
                },
                bioPendidikan: {
                    NIM: rows[i]['Nomor Identitas Mahasiswa (NIM) / NISN'],
                    NPSN: rows[i]['Nomor Identitas Kampus/Sekolah'],
                    fotoIPKAtauRapor: rows[i]['Foto Transkrip Nilai Terbaru'],
                    fotoKTM: rows[i]['Foto Kartu Identitas Kampus/Sekolah'],
                    jurusan: rows[i]['Jurusan Kuliah/Kelas Sekolah'],
                    tingkatPendidikan: rows[i]['Tingkat Pendidikan']
                },
                lampiranTambahan: rows[i]['Upload PDF dokumen tambahan yang relevan'],
                lampiranPersetujuan: "-",
                misc: {
                    beasiswaTerdaftar: idCampaign
                },
                motivationLetter: {
                    ceritaKegiatanYangDigeluti: rows[i]['Cerita Mengenai Kegiatan yang Digeluti Saat Ini di Sekolah/Kuliah'],
                    ceritaLatarBelakang: rows[i]['Cerita Latar Belakang Diri & Keluarga'],
                    ceritaPentingnyaBeasiswa: rows[i]['Cerita Pentingnya Beasiswa Ini untuk Anda'],
                    ceritaPerjuangan: rows[i]['Cerita Perjuangan Melanjutkan Pendidikan'],
                    fotoBuktiKegiatan: rows[i]['Foto Bukti Kegiatan Sekolah/Kuliah']
                },
                notes: "",
                pengajuanBantuan: {
                    ceritaPenggunaanDana: rows[i]['Cerita rencana penggunaan dana'],
                    fotoBuktiTunggakan: rows[i]['Foto Bukti Tagihan / Tunggakan'],
                    fotoRumah: rows[i]['Foto Rumah Jelas'],
                    kebutuhan: rows[i]['Kebutuhan'], 
                    kepemilikanRumah: rows[i]['Kepemilikan Rumah'],
                    totalBiaya: rows[i]['Total biaya yang dibutuhkan'],
                },
                scoreApplicant: {
                    total: scoreApplicant.total,
                    scoreProvinsi: scoreApplicant.scoreProvinsi,
                    scoreKota: scoreApplicant.scoreKota,
                    scoreMedsos: scoreApplicant.scoreMedsos,
                    scoreKepemilikanRumah: scoreApplicant.scoreKepemilikanRumah,
                    scoreNIK: scoreApplicant.scoreNIK,
                    scoreRumah: scoreApplicant.scoreRumah,
                    scoreDana: scoreApplicant.scoreDana,
                    scoreLatarBelakang: scoreApplicant.scoreLatarBelakang,
                    scorePerjuangan: scoreApplicant.scorePerjuangan,
                    scorePenting: scoreApplicant.scorePenting,
                    scoreKegiatan: scoreApplicant.scoreKegiatan
                },
                reviewer: "",
                statusApplicant: "pending",
                statusData: scoreApplicant.statusData,
                statusRumah: scoreApplicant.statusRumah,
            }

            //adding the data from a row to database

            var docRef = applicantRef.doc();
            docRef.set(dataInputUser).then(
                campaignRef.doc(idCampaign).get().then((data) => {
                    const listApplicants = data.data().applicants
                    const dataLength = listApplicants.length
                    const dataPush = {
                        id: docRef.id,
                        score: scoreApplicant.total,
                        page
                    }

                    //making sorting algorithm for applicant's score
                    //if it's the first applicant, then immediately insert it
                    if(dataLength === 0){
                        listApplicants.push(dataPush)
                        campaignRef.doc(idCampaign).update({applicants: listApplicants})
                    } else if(scoreApplicant.total < listApplicants[dataLength-1].score){ //if it's not the first applicant
                        listApplicants.push(dataPush)
                        campaignRef.doc(idCampaign).update({applicants: listApplicants})
                    } else {
                        for(let i = 0; i < dataLength; i++){
                            if(scoreApplicant.total >= listApplicants[i].score){ //if curr applicant's score not lower than lowest score in array, then look for position for curr applicant's score
                                listApplicants.splice(i,0,dataPush)
                                campaignRef.doc(idCampaign).update({applicants: listApplicants})
                                i = dataLength
                            }
                        }
                    }
                })
            )
        }
    }

    const updateCampaignProcess = async() => {
        try{ 
            await processApplicantData()
            campaignRef.doc(idCampaign).update({process: "1"})
            res.status(201).send({
                error: false,
                message: "All data has already fetched and created"
            })
        } catch (e) {
            res.status(404).send({
                error: true,
                message: e.message
            })
        }
    }

    //checking if the process for a campaign has already done
    campaignRef.doc(idCampaign).get().then((data) => {
        try{
            if(data.data().process === "0"){
                updateCampaignProcess();
            } else if(data.data().process === "1"){
                res.status(200).send({
                    error: true,
                    message: "The data for this campaign has already processed"
                })
            } else {
                res.status(500).send({
                    error: true,
                    message: "Unknown process status"
                })
            }
        } catch (e) {
            res.status(500).send({
                error: true,
                message: "Internal server error"
            })
        }
    })
})


route.get('/:id/applicants/givePageNumber', auth, checkCampaign,(req,res) => {
    const campaignRef = db.collection('campaigns')
    let setPage = 1;
    let pageCount = 0;
    const idCampaign = req.params.id

    let givePageNumber = async() => {
        campaignRef.doc(idCampaign).get().then((data) => {
            const detailDataApplicants = data.data().applicants;
            const status = data.data().pageNumber;
            if(detailDataApplicants === [] || detailDataApplicants === undefined){
                res.status(200).send({
                    error: false,
                    message: "Data not available yet"
                })
            } else if(status === "0"){
                for(let i = 0; i < detailDataApplicants.length; i++){
                    if(pageCount !== 0 && pageCount % 10 === 0){
                        setPage++;
                    }
                    detailDataApplicants[i].page = setPage
                    pageCount++;
                }
                campaignRef.doc(idCampaign).update({applicants: detailDataApplicants, pageNumber: "1"})
                res.status(200).send({
                    error: false,
                    message: "Success giving number page"
                })
            } else if(status === "1"){
                res.status(200).send({
                    error: true,
                    message: "Giving pageNumber has been done"
                })
            } else {
                res.status(500).send({
                    error: true,
                    message: "Internal server error"
                })
            }
        })
    }

    givePageNumber();
})

//API to get all available campaigns
route.get('/',auth, (req,res) => {
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
                    photoUrl: campaignDataDetails.photoUrl,
                    SnK: campaignDataDetails.SnK
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

//API to post new campaign
route.post('/', auth, (req,res) => {
    campaignRef = db.collection('campaigns')

    namaBeasiswa = req.body.namaBeasiswa
    penggalangDana = req.body.penggalangDana
    SnK = req.body.SnK
    photoUrl = req.body.photoUrl
    idgsheet = req.body.idGSheet

    if(namaBeasiswa === undefined || namaBeasiswa === "" || penggalangDana === undefined || penggalangDana === "" || SnK === undefined || SnK === "" || photoUrl === undefined || photoUrl === "" || idgsheet === undefined || idgsheet === ""){
        res.status(409).send({
            error: true,
            message: "Can't add campaign because data sent isn't complete"
        })
    }else {
        sendData = {
            name: namaBeasiswa,
            penggalangDana: penggalangDana,
            photoUrl,
            process: "0",
            pageNumber: "0",
            SnK,
            applicants: [],
            idGSheet: idgsheet
        }
    
        campaignRef.doc().set(sendData)
    
        res.status(201).send({
            error: false,
            message: "Campaign added"
        })
    }
})

//get specific scholarship program details
route.get('/:id', auth, checkCampaign, (req,res) => {
    const id = req.params.id
    const campaignRef = db.collection('campaigns');
    const applicantRef = db.collection('applicants');
    let listApplicants = [];
    let counterRejected = 0;
    let counterAccepted = 0;
    let counterOnHold = 0;
    let applicantsNumber = 0;
    let counterPending = 0;
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
                    processData: campaignData.process,
                    processPageNumber: campaignData.pageNumber,
                    applicantsCount: 0,
                    acceptedApplicants: 0,
                    rejectedApplicants: 0,
                    onHoldApplicants: 0,
                    pendingApplicants: 0,
                }
                res.status(200).send({
                    error: false,
                    message: "Campaign details fetched",
                    Data: sendData
                })
            }

            //if there's at least 1 applicant
            detailCampaignData.forEach((d) => {
                applicantRef.doc(d.id).get().then((userData) => {
                    const userDataDetails = userData.data()

                    //just in case if one of the applicants not found in db
                    if(userDataDetails === undefined){
                        res.status(200).send({
                            message: `Failed to fetch applicants with id ${d.id}. not registered in db.`
                        })
                    }
                    //else if applicants found in db
                    else{
                        if(userDataDetails.statusApplicant === 'rejected'){
                            counterRejected++
                            applicantsNumber++
                        }else if(userDataDetails.statusApplicant === 'accepted'){
                            counterAccepted++
                            applicantsNumber++
                        }else if(userDataDetails.statusApplicant === 'onhold'){
                            counterOnHold++
                            applicantsNumber++
                        } else if(userDataDetails.statusApplicant === "pending"){
                            counterPending++
                            applicantsNumber++
                        }
                        
                        counter++
    
                         //if it's already the last data, then send it
                         if(counter === detailCampaignData.length){
                            const sendData = {
                                name: campaignData.name,
                                penggalangDana: campaignData.penggalangDana,
                                photoUrl: campaignData.photoUrl,
                                processData: campaignData.process,
                                processPageNumber: campaignData.pageNumber,
                                applicantsCount: applicantsNumber,
                                acceptedApplicants: counterAccepted,
                                rejectedApplicants: counterRejected,
                                onHoldApplicants: counterOnHold,
                                pendingApplicants: counterPending
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
        res.status(500).send({
            message: "Internal server error"
        })
    }
})

//getting all pending applicants from specific scholarship program
route.get('/:id/applicants', checkCampaign, (req,res) => {
    const campaignRef = db.collection('campaigns');
    const applicantRef = db.collection('applicants');

    const id = req.params.id;
    const status = req.query.status;
    const nama = req.query.nama;
    const statusRumah = req.query.statusRumah;
    const statusData = req.query.statusData;
    const provinsi = req.query.provinsi;
    const pageNumber = req.query.page
    
    let listApplicants = [];
    let counter = 0;

    try{
        campaignRef.doc(id).get().then((data) => {
            const campaignName = data.data().name
            if(id === data.id){
                const applicantsInCampaign = data.data().applicants
                if(applicantsInCampaign.length > 0){
                    applicantsInCampaign.forEach((d) => {
                        applicantRef.doc(d.id).get().then((userData) => {

                            const userDataDetails = userData.data()
                            const dataSend = {
                                id: userData.id,
                                photoURL: userDataDetails.bioDiri.fotoDiri,
                                name: userDataDetails.bioDiri.namaLengkap,
                                provinsi: userDataDetails.bioDiri.provinsi,
                                kota: userDataDetails.bioDiri.kotaKabupaten,
                                university: userDataDetails.bioPendidikan.NPSN,
                                score: userDataDetails.scoreApplicant.total,
                                statusApplicant: userDataDetails.statusApplicant,
                                statusData: userDataDetails.statusData,
                                statusRumah: userDataDetails.statusRumah,
                                page: d.page,
                                }  
                                    
                            const length = listApplicants.length;

                            if(length === 0){
                                listApplicants.push(dataSend)
                            }else if(dataSend.score < listApplicants[length-1].score){
                                listApplicants.push(dataSend)
                            }else{
                                for(let i = 0; i < length; i++){
                                    if(dataSend.score >= listApplicants[i].score){
                                        listApplicants.splice(i,0,dataSend)
                                        i = length
                                    }
                                }
                            }

                            counter++;
                            //if it's already the last data, then send it
                            if(counter === applicantsInCampaign.length){
                                if(status !== undefined){
                                    for(let i = 0; i < applicantsInCampaign.length; i++){
                                        for(let j = 0; j < listApplicants.length; j++){
                                            const lower_status = status.toLowerCase() //status from query
                                            const statusInsideList = listApplicants[j].statusApplicant; //status from array
                                            const lower_statusInsideList = statusInsideList.toLowerCase();
                                            if(lower_statusInsideList !== lower_status){
                                                listApplicants.splice(j,1)
                                            }
                                        }
                                    }
                                }

                                if(nama !== undefined){
                                    for(let i = 0; i < applicantsInCampaign.length; i++){
                                        for(let j = 0; j < listApplicants.length; j++){
                                            const lower_nama = nama.toLowerCase() //name from query
                                            const namaInsideList = listApplicants[j].name; //name from array
                                            const lower_namaInsideList = namaInsideList.toLowerCase();
                                            if(!lower_namaInsideList.includes(lower_nama)){
                                                listApplicants.splice(j,1)
                                            }
                                        }
                                    }
                                } 

                                if(provinsi !== undefined){
                                    for(let i = 0; i < applicantsInCampaign.length; i++){
                                        for(let j = 0; j < listApplicants.length; j++){
                                            const lower_provinsi = provinsi.toLowerCase() //provinsi from query
                                            const provinsiInsideList = listApplicants[j].provinsi; //provinsi from array
                                            const lower_provinsiInsideList = provinsiInsideList.toLowerCase();
                                            if(!lower_provinsiInsideList.includes(lower_provinsi)){
                                                listApplicants.splice(j,1)
                                            }
                                        }
                                    }
                                }

                                if(statusRumah !== undefined){
                                    for(let i = 0; i < applicantsInCampaign.length; i++){
                                        for(let j = 0; j < listApplicants.length; j++){
                                            const lower_statusRumah = statusRumah.toLowerCase() //statusRumah from query
                                            const SRInsideList = listApplicants[j].statusRumah; //statusRumah from array
                                            const lower_SRInsideList = SRInsideList.toLowerCase();
                                            if(lower_SRInsideList !== lower_statusRumah){
                                                listApplicants.splice(j,1)
                                            }
                                        }
                                    }
                                }

                                if(statusData !== undefined){
                                    for(let i = 0; i < applicantsInCampaign.length; i++){
                                        for(let j = 0; j < listApplicants.length; j++){
                                            const lower_statusData = statusData.toLowerCase() //statusData from query
                                            const SDInsideList = listApplicants[j].statusData; //statusData from array
                                            const lower_SDInsideList = SDInsideList.toLowerCase();
                                            if(lower_SDInsideList !== lower_statusData){
                                                listApplicants.splice(j,1)
                                            }
                                        }
                                    }
                                }

                                if(pageNumber !== undefined){
                                    for(let i = 0; i < applicantsInCampaign.length; i++){
                                        for(let j = 0; j < listApplicants.length; j++){
                                            const pageInList = listApplicants[j].page; //page from array
                                            if(pageNumber != pageInList){
                                                listApplicants.splice(j,1)
                                            }
                                        }
                                    }
                                }
                                
                                res.status(200).send({
                                    error: false,
                                    message: "All applicants successfully fetched",
                                    campaign: campaignName,
                                    listApplicants
                                })
                            }
                        })
                    })
                }else{
                    res.status(200).send({
                        error: false,
                        message: "All applicants successfully fetched",
                        campaign: campaignName,
                        listApplicants
                    })
                }  
            }else{
                res.status(500).send({
                    error: true,
                    message: "Internal server error"
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