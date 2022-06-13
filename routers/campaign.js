const express = require('express');
const admin = require('firebase-admin');
const dbconf = require('../config/firebase conf.js');
const checkCampaign = require('../midWare/checkCampaign.js');
const auth = require('../midWare/auth.js');
const score = require('./getApplicantScore');
const dotenv = require('dotenv');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { default: axios } = require('axios');
const sortArray = require('sort-array');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

require('dotenv').config();

const route = express();

const db = dbconf.firestore();

//To read data from GSheet and send all data needed for prediction to flask. finnally input the data readed to database
route.post('/:id/applicants/processData',auth, checkCampaign, (req,res) => {
    const campaignRef = db.collection('campaigns');
    const applicantRef = db.collection('applicants');
    const idCampaign = req.params.id;
    let lastApplicantNumber = 0;
    let idGSheet = '';
    let scoreApplicant = '';
    let rows = [];
    let namaCampaign = '';

    let configSheet = async() => {
        try{
            await campaignRef.doc(idCampaign).get().then((data) => {
                idGSheet = data.data().idGSheet
                namaCampaign = data.data().name
            })
        
            const doc = new GoogleSpreadsheet(idGSheet);
        
            doc.useServiceAccountAuth({
                client_email: process.env.GSHEET_CLIENT_EMAIL,
                private_key: process.env.GSHEET_PRIVATE_KEY.replace(/\\n/g, '\n')
            });
        
            await doc.loadInfo()
        
            const sheet = doc.sheetsByIndex[0];
            
            rows = await sheet.getRows();
        }catch(e){
            res.status(404).send({
                error: false,
                message: e.message
            })
        }
    }

    let processApplicantData = async(statusProcess) => {
        
        //if it's the first time the data being processed
        if(statusProcess == 0){
            for(let i = 0; i < rows.length; i++){
                dataUser = {
                    "Provinsi": rows[i]['Provinsi Tempat Tinggal'],
                    "Kota/Kabupaten": rows[i]['Kota/Kabupaten'],
                    "Medsos": rows[i]['Akun Media Sosial'],
                    "Status Rumah":  rows[i]['Kepemilikan Rumah'],
                    "NIK": rows[i]['Nomor KTP'],
                    "Foto KTP": rows[i]['Foto KTP'],
                    "Foto Rumah": rows[i]['Foto Rumah Jelas'],
                    "Cerita Penggunaan Dana": rows[i]['Ceritakan Rencana Penggunaan Dana'],
                    "Cerita Latar Belakang": rows[i]['Ceritakan latar belakang diri dan keluarga'],
                    "Cerita Perjuangan": rows[i]['Ceritakan perjuangan melanjutkan kuliah/sekolah'],
                    "Beasiswa Penting": rows[i]['Ceritakan mengapa beasiswa ini penting untuk kamu'],
                    "Cerita Kegiatan": rows[i]['Ceritakan kegiatan yang digeluti di sekolah/kampus']
                }
        
                //sending the data to flask server
                scoreApplicant = await score(dataUser)
    
                //prepare the data to be sent to DB
                const dataInputUser = {
                    bioDiri: { 
                        NIK: rows[i]['Nomor KTP'],
                        alamat: rows[i]['Alamat Lengkap'],
                        fotoDiri: rows[i]['Foto Kamu (Portrait)'],
                        fotoKTP: rows[i]['Foto KTP'],
                        kotaKabupaten: rows[i]['Kota/Kabupaten'],
                        namaLengkap: rows[i]['Nama Lengkap'],
                        noTlp: rows[i]['Nomor Telepon'],
                        provinsi: rows[i]['Provinsi Tempat Tinggal'],
                        sosmedAcc: rows[i]['Akun Media Sosial']
                    },
                    bioPendidikan: {
                        NIM: rows[i]['Nomor Identitas di Kampus/Sekolah'],
                        universitasAtauSekolah: rows[i]['Nama Universitas/Sekolah'],
                        fotoIPKAtauRapor: rows[i]['Foto IPK/Raport Sekolah'],
                        fotoKTM: rows[i]['Foto Kartu Identitas Kampus/Sekolah'],
                        jurusan: rows[i]['Jurusan Kuliah/Kelas Sekolah'],
                        tingkatPendidikan: rows[i]['Tingkat Pendidikan Terakhir (sedang dijalani)']
                    },
                    lampiranTambahan: rows[i]['Informasi Tambahan'],
                    lampiranPersetujuan: rows[i]['Lembar persetujuan mengenai data yang disubmit adalah benar & berkenan untuk dibagikan ke pihak yang relevan'],
                    misc: {
                        beasiswaTerdaftar: namaCampaign
                    },
                    motivationLetter: {
                        ceritaKegiatanYangDigeluti: rows[i]['Ceritakan kegiatan yang digeluti di sekolah/kampus'],
                        ceritaLatarBelakang: rows[i]['Ceritakan latar belakang diri dan keluarga'],
                        ceritaPentingnyaBeasiswa: rows[i]['Ceritakan mengapa beasiswa ini penting untuk kamu'],
                        ceritaPerjuangan: rows[i]['Ceritakan perjuangan melanjutkan kuliah/sekolah'],
                        fotoBuktiKegiatan: rows[i]['Foto bukti kegiatan di sekolah/kampus']
                    },
                    notes: "",
                    pengajuanBantuan: {
                        ceritaPenggunaanDana: rows[i]['Ceritakan Rencana Penggunaan Dana'],
                        fotoBuktiTunggakan: rows[i]['Foto Bukti Tunggakan/Tagihan'],
                        fotoRumah: rows[i]['Foto Rumah Jelas'],
                        kebutuhan: rows[i]['Kebutuhan Pembiayaan'], 
                        kepemilikanRumah: rows[i]['Kepemilikan Rumah'],
                        totalBiaya: rows[i]['Total Biaya yang Dibutuhkan'],
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
                    addedAt: new Date()
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
        } else if(statusProcess == 1){ //if it has been processed before (want to add new applicant)
            for(let i = lastApplicantNumber; i < rows.length; i++){
                dataUser = {
                    "Provinsi": rows[i]['Provinsi Tempat Tinggal'],
                    "Kota/Kabupaten": rows[i]['Kota/Kabupaten'],
                    "Medsos": rows[i]['Akun Media Sosial'],
                    "Status Rumah":  rows[i]['Kepemilikan Rumah'],
                    "NIK": rows[i]['Nomor KTP'],
                    "Foto KTP": rows[i]['Foto KTP'],
                    "Foto Rumah": rows[i]['Foto Rumah Jelas'],
                    "Cerita Penggunaan Dana": rows[i]['Ceritakan Rencana Penggunaan Dana'],
                    "Cerita Latar Belakang": rows[i]['Ceritakan latar belakang diri dan keluarga'],
                    "Cerita Perjuangan": rows[i]['Ceritakan perjuangan melanjutkan kuliah/sekolah'],
                    "Beasiswa Penting": rows[i]['Ceritakan mengapa beasiswa ini penting untuk kamu'],
                    "Cerita Kegiatan": rows[i]['Ceritakan kegiatan yang digeluti di sekolah/kampus']
                }
        
                //sending the data to flask server
                scoreApplicant = await score(dataUser)
                console.log(rows[i]['Nama lengkap'])
                //prepare the data to be sent to DB
                const dataInputUser = {
                    bioDiri: { 
                        NIK: rows[i]['Nomor KTP'],
                        alamat: rows[i]['Alamat Lengkap'],
                        fotoDiri: rows[i]['Foto Kamu (Portrait)'],
                        fotoKTP: rows[i]['Foto KTP'],
                        kotaKabupaten: rows[i]['Kota/Kabupaten'],
                        namaLengkap: rows[i]['Nama Lengkap'],
                        noTlp: rows[i]['Nomor Telepon'],
                        provinsi: rows[i]['Provinsi Tempat Tinggal'],
                        sosmedAcc: rows[i]['Akun Media Sosial']
                    },
                    bioPendidikan: {
                        NIM: rows[i]['Nomor Identitas di Kampus/Sekolah'],
                        universitasAtauSekolah: rows[i]['Nama Universitas/Sekolah'],
                        fotoIPKAtauRapor: rows[i]['Foto IPK/Raport Sekolah'],
                        fotoKTM: rows[i]['Foto Kartu Identitas Kampus/Sekolah'],
                        jurusan: rows[i]['Jurusan Kuliah/Kelas Sekolah'],
                        tingkatPendidikan: rows[i]['Tingkat Pendidikan Terakhir (sedang dijalani)']
                    },
                    lampiranTambahan: rows[i]['Informasi Tambahan'],
                    lampiranPersetujuan: rows[i]['Lembar persetujuan mengenai data yang disubmit adalah benar & berkenan untuk dibagikan ke pihak yang relevan'],
                    misc: {
                        beasiswaTerdaftar: namaCampaign
                    },
                    motivationLetter: {
                        ceritaKegiatanYangDigeluti: rows[i]['Ceritakan kegiatan yang digeluti di sekolah/kampus'],
                        ceritaLatarBelakang: rows[i]['Ceritakan latar belakang diri dan keluarga'],
                        ceritaPentingnyaBeasiswa: rows[i]['Ceritakan mengapa beasiswa ini penting untuk kamu'],
                        ceritaPerjuangan: rows[i]['Ceritakan perjuangan melanjutkan kuliah/sekolah'],
                        fotoBuktiKegiatan: rows[i]['Foto bukti kegiatan di sekolah/kampus']
                    },
                    notes: "",
                    pengajuanBantuan: {
                        ceritaPenggunaanDana: rows[i]['Ceritakan Rencana Penggunaan Dana'],
                        fotoBuktiTunggakan: rows[i]['Foto Bukti Tunggakan/Tagihan'],
                        fotoRumah: rows[i]['Foto Rumah Jelas'],
                        kebutuhan: rows[i]['Kebutuhan Pembiayaan'], 
                        kepemilikanRumah: rows[i]['Kepemilikan Rumah'],
                        totalBiaya: rows[i]['Total Biaya yang Dibutuhkan'],
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
                    addedAt: new Date()
                }

                var docRef = applicantRef.doc();
                docRef.set(dataInputUser).then(
                    campaignRef.doc(idCampaign).get().then((data) => {
                        const listApplicants = data.data().applicants
                        const dataLength = listApplicants.length
                        const dataPush = {
                            id: docRef.id,
                            score: scoreApplicant.total,
                        }
                        
                        if(scoreApplicant.total < listApplicants[dataLength-1].score){
                            listApplicants.push(dataPush)
                            campaignRef.doc(idCampaign).update({applicants: listApplicants})
                        }else{
                            for(i = 0; i < dataLength; i++){
                                if(scoreApplicant.total >= listApplicants[i].score){
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
    }

    let inputingListUser = async(statusProcess) => {
        try{ 
            await processApplicantData(statusProcess)
            campaignRef.doc(idCampaign).update({process: "1"})
        } catch (e) {
            res.status(404).send({
                error: true,
                message: e.message
            })
        }
    }

    let updatingListUser = async(statusProcess) => {
        try{ 
            await processApplicantData(statusProcess)
        } catch (e) {
            res.status(404).send({
                error: true,
                message: e.message
            })
        }
    }

    //checking if the process for a campaign has already done
    const main = async() => {
        await configSheet(); //waiting until connection to sheet established before continuing
        campaignRef.doc(idCampaign).get().then((data) => {
            lastApplicantNumber = data.data().applicants.length;
            if(lastApplicantNumber == rows.length){
                res.status(200).send({
                    error: false,
                    message: "No new applicant(s)"
                })
            } else if(lastApplicantNumber > rows.length){
                res.status(200).send({
                    error: true,
                    message: "Data in app more than data in Sheet, there's double data applicant. please restart all process"
                })
            }else if(data.data().process === "0"){
                const process_1 = async()=>{
                    const statusProcess = data.data().process;
                    //make it await so the campaignRef below will get newest data
                    await inputingListUser(statusProcess);
                    await campaignRef.doc(idCampaign).get().then((data) => {
                        totalApplicant = data.data().applicants.length
                        campaignRef.doc(idCampaign).update({totalApplicant: totalApplicant+1})
                    })

                    res.status(201).send({
                        error: false,
                        message: "All data has already fetched and created"
                    })
                }

                process_1();

            } else if(data.data().process === "1"){
                const process_1 = async() => {
                    const statusProcess = data.data().process;
                    //make it await so the campaignRef below will get newest data
                    await updatingListUser(statusProcess);
                    await campaignRef.doc(idCampaign).get().then((data) => {
                        totalApplicant = data.data().applicants.length
                        campaignRef.doc(idCampaign).update({totalApplicant: totalApplicant+1})
                    })

                    
                    res.status(201).send({
                        error: false,
                        message: "All new applicant already fetched"
                    })
                }
                process_1();
            } else {
                res.status(500).send({
                    error: true,
                    message: "Unknown process status"
                })
            }
        })
    }
    main();
})

//API to get all available campaigns
route.get('/', auth, (req,res) => {
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
                    SnK: campaignDataDetails.SnK,
                    addedAt: campaignDataDetails.addedAt
                }

                campaignList.push(fetchedData)
            })
            
            if(campaignList.length !== 0){
                const sortedArray = sortArray(campaignList, {
                    by: 'addedAt',
                })
                res.status(200).send({
                    error: false,
                    message: "Data successfully fetched",
                    listCampaign: sortedArray
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
            SnK,
            applicants: [],
            idGSheet: idgsheet,
            totalApplicant: 0,
            addedAt: new Date()
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
route.get('/:id/applicants', auth, checkCampaign, (req,res) => {
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

    let pageCounter = 0;
    let page = 0;

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
                                universitasAtauSekolah: userDataDetails.bioPendidikan.universitasAtauSekolah,
                                score: userDataDetails.scoreApplicant.total,
                                statusApplicant: userDataDetails.statusApplicant,
                                statusData: userDataDetails.statusData,
                                statusRumah: userDataDetails.statusRumah,
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
                                //only include data with requested applicant's status
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

                                //only include data with requested applicant's name
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

                                //only include data with requested applicant's province
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

                                //only include data with requested applicant's house status
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

                                //only include data with requested Applicant's data status
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
                                
                                //giving page based on data position in array
                                listApplicants.forEach((data) => {
                                    if(pageCounter % 10 === 0){ //page number will increase after 10
                                        page++;
                                    }
                                    data.page = page;
                                    pageCounter++;
                                })

                                //only include data with requested pageNumber
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
                                    listApplicants: listApplicants
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

//API for getting CSV of accepted applicants
route.get('/:id/downloadResult', auth, checkCampaign, (req,res) => {
    campaignRef = db.collection('campaigns')
    applicantRef = db.collection('applicants')
    const idCampaign = req.params.id
    let counter = 0;
    let listApplicantsAcc = [];

    campaignRef.doc(idCampaign).get().then((dataCampaign) => {
        const listApplicants = dataCampaign.data().applicants
        const namaCampaign = dataCampaign.data().name
        listApplicants.forEach((dataApplicant) => [
            applicantRef.doc(dataApplicant.id).get().then((data) => {
                const detailDataApplicant = data.data()
                
                if(detailDataApplicant.statusApplicant === "accepted"){
                    listApplicantsAcc.push(detailDataApplicant)
                } 
                counter++;

                if(counter === listApplicants.length){
                    const makeCSV = async(date) => {
                        try{
                            const sortByScore = sortArray(listApplicantsAcc, {
                                by: 'scoreApplicant.total'
                            })

                        let localPath = `Records/`
                        let fileName = `Accepted_Applicants_${namaCampaign}_${date}.csv`
                        let fullPath = localPath.concat(fileName)
                        
                        const csvWriter = createCsvWriter({
                            path: fullPath,
                            headerIdDelimiter: '.',
                            header: [
                              {id: 'bioDiri.NIK', title: 'NIK'},
                              {id: 'bioDiri.alamat', title: 'alamat'},
                              {id: 'bioDiri.fotoDiri', title: 'fotoDiri'},
                              {id: 'bioDiri.fotoKTP', title: 'fotoKTP'},
                              {id: 'bioDiri.kotaKabupaten', title: 'kota / Kabupaten'},
                              {id: 'bioDiri.namaLengkap', title: 'Nama Lengkap'},
                              {id: 'bioDiri.noTlp', title: 'noTlp'},
                              {id: 'bioDiri.provinsi', title: 'provinsi'},
                              {id: 'bioDiri.sosmedAcc', title: 'sosmedAcc'},
                              {id: 'bioPendidikan.NIM', title: 'NIM'},
                              {id: 'bioPendidikan.universitasAtauSekolah', title: 'NPSN'},
                              {id: 'bioPendidikan.fotoIPKAtauRapor', title: 'Foto IPK / Rapor'},
                              {id: 'bioPendidikan.fotoKTM', title: 'fotoKTM'},
                              {id: 'bioPendidikan.jurusan', title: 'jurusan'},
                              {id: 'bioPendidikan.tingkatPendidikan', title: 'Tingkat Pendidikan'},
                              {id: 'lampiranTambahan', title: 'Lampiran Tambahan'},
                              {id: 'lampiranPersetujuan', title: 'Lampiran Persetujuan'},
                              {id: 'misc.beasiswaTerdaftar', title: 'Beasiswa Terdaftar'},
                              {id: 'motivationLetter.ceritaKegiatanYangDigeluti', title: 'Cerita Kegiatan Yang Digeluti'},
                              {id: 'motivationLetter.ceritaLatarBelakang', title: 'Cerita Latar Belakang'},
                              {id: 'motivationLetter.ceritaPentingnyaBeasiswa', title: 'Cerita Pentingnya Beasiswa'},
                              {id: 'motivationLetter.ceritaPerjuangan', title: 'Cerita Perjuangan'},
                              {id: 'motivationLetter.fotoBuktiKegiatan', title: 'Foto Bukti Kegiatan'},
                              {id: 'notes', title: 'Notes'},
                              {id: 'pengajuanBantuan.ceritaPenggunaanDana', title: 'Cerita Penggunaan Dana'},
                              {id: 'pengajuanBantuan.fotoBuktiTunggakan', title: 'Foto Bukti Tunggakan'},
                              {id: 'pengajuanBantuan.fotoRumah', title: 'Foto Rumah'},
                              {id: 'pengajuanBantuan.kebutuhan', title: 'kebutuhan'},
                              {id: 'pengajuanBantuan.kepemilikanRumah', title: 'Status kepemilikan Rumah'},
                              {id: 'pengajuanBantuan.totalBiaya', title: 'Total Biaya'},
                              {id: 'scoreApplicant.total', title: 'Score Total'},
                              {id: 'statusData', title: 'Status Data'},
                              {id: 'statusRumah', title: 'Status Rumah'},
                            ]
                        });
                        csvWriter.writeRecords(sortByScore);

                        return fileName;

                        }catch(e){
                            res.status(500).send({
                                error: true,
                                message: e.message
                            })
                        }
                    }

                    const main = async() => {
                        const date = new Date()
                        let year = date.getFullYear() + "";
                        let month = date.getMonth() + "";
                        let day = date.getDate() + "";
                        let ID = year.concat(month).concat(day)

                        const fileName = await makeCSV(ID);
                        
                        var defaultStorage = dbconf.storage()
                        
                        var bucket = defaultStorage.bucket('gs://kitabisa-schlrship-filter.appspot.com')
                        
                        bucket.upload( `Records/${fileName}`, {destination: `Records/${fileName}`})

                        const options = {
                            version: 'v4',
                            action: 'read',
                            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
                          };
                        const getFileURL= await bucket.file(`Records/${fileName}`).getSignedUrl(options)

                        res.status(200).send({
                            error: false,
                            fileDownload: getFileURL
                        })
                    }

                    main();
                }
            })
        ])
    })
})

module.exports = route