# How to run the code
1. Download all files
2. Install Nodejs and NPM
3. Get credentials from Firebase (please make your own firebase and get the credentials to connect it with the main server)
4. Get service account credentials for gsheet API (please make your own GCP project and enable sheet API and get the SA credentials)
5. Put all credentials in .env file with the name corresponding to naming given in fireconfig.js (Firebase SA) and first endpoint in campaign.js (gsheet SA)
6. Do npm install in the terminal (should be done in the right directory)
7. Open server.js and server-model.py
8. Node server.js for server.js and python3 server-model.py for server-model.py in the terminal (should be done in the right directory)
9. You should good to go

# API usage guide

## Table of contents
1. [Endpoint](#endpoint) 
2. [Login](#login)
3. [Users](#users)
    1. [Adding new user](#adding-new-user)
    2. [Get specific user](#getting-specific-user)
4. [Campaigns](#campaigns)
    1. [Get all available campaigns](#get-all-available-campaigns)
    2. [Post to add new campaign](#post-to-add-new-campaign)
    3. [Get specific scholarship program details](#get-specific-scholarship-program-details)
    4. [Get applicants in a specific scholarship program](#get-applicants-in-a-specific-scholarship-program)
    5. [Activating process Data for a campaign](#activating-process-data-for-a-campaign)
    6. [Downloading all accepted applicants data](#downloading-all-accepted-applicants-data)
5. [Applicants](#applicants)
    1. [Get specific applicants detail](#get-specific-applicants-detail)
    2. [Update specific applicant status](#update-specific-applicant-status)

## Endpoint
http://34.101.51.145

## Login
- URL
  - /login
- Method
  - POST
- Request body
  - email as string
  - password as string
- Response
```
{
    "message": "Berhasil login",
    "dataUserLogin": {
        "id": "7eLYKX6ybc546EpElvZu",
        "firstName": "test",
        "lastName": "test"
    }
}
```

## Users
### Adding new user
- URL
  - /users
- Method
  - POST
- Request Body
  - firstName as string
  - lastName as string
  - email as string + has to be unique among others
  - password as string
- Response
```
{
    "message": "User berhasil ditambahkan"
}
```

if registering with registered email

```
{
    "message": "Gagal mendaftar. email sudah terdaftar"
}
```

### Getting specific user
- URL
  - /users?id=INSERT_USER_ID
- Method
  - GET
- Query parameter
  - id as string
- Response
```
{
    "message": "User berhasil ditemukan",
    "dataUser": {
        "id": "4pshmWmeV1aD6VJqDi3U",
        "firstName": "Mamed",
        "lastName": "Dramzyy",
        "email": "mameddramddd@gmail.com"
    }
}
```

## Campaigns
### Get all available campaigns
- URL
  - /campaigns
- Method
  - GET
- Response
```
{
    "error": false,
    "message": "Data successfully fetched",
    "listCampaign": [
        {
            "id": "2MITdua2vK5LlRpfN0jo",
            "name": "Beasiswa Narasi",
            "penggalangDana": "Narasi",
            "photoUrl": "https://firebasestorage.googleapis.com/v0/b/kitabisa-schlrship-filter.appspot.com/o/Beasiswa-Celengan-Narasi.jpg?alt=media&token=dc502c16-e25f-4699-a8a2-e25148681839",
            "SnK": "Beasiswa Narasi akan disalurkan hanya untuk kepentingan biaya pendidikan (UKT, SKS) atau penunjang pendidikan (skripsi, penelitian, dll)., Beasiswa Narasi hanya untuk membantu kebutuhan pendidikan mahasiswa tingkat S1 di Perguruan Tinggi Negeri (PTN) dan Perguruan Tinggi Swasta (PTS), Calon penerima beasiswa berstatus mahasiswa aktif, Nominal biaya pendidikan maupun penunjang pendidikan yang dapat diajukan oleh mahasiswa maksimal Rp 10.000.000 (sepuluh juta rupiah), Setiap kandidat yang terpilih mendapatkan beasiswa bersedia untuk diangkat profilnya di media sosial Narasi dan Kitabisa.",
            "addedAt": {
                "_seconds": 1654265588,
                "_nanoseconds": 0
            }
        }
}
```

### Post to add new campaign
- URL
    - /campaigns
- Method
    - POST
- Request parameter
    - namaBeasiswa as string
    - penggalangDana as string
    - SnK as string
    - photoUrl as string
    - idGSheet as string
- Response
if all 4 parameter available
```
{
    "error": false,
    "message": "Campaign added"
}
```
if only one of 4 parameter null or ""
```
{
    "error": true,
    "message": "Can't add campaign because data sent isn't complete"
}
```

### Get specific scholarship program details
- URL
  - /campaigns/{campaign_id}
- Method
  - GET
- URL parameter
  - id as string
- Response
```
{
    "error": false,
    "message": "Campaign details fetched",
    "Data": {
        "name": "Beasiswa Narasi",
        "penggalangDana": "Narasi",
        "photoUrl": "https://firebasestorage.googleapis.com/v0/b/kitabisa-schlrship-filter.appspot.com/o/Beasiswa-Celengan-Narasi.jpg?alt=media&token=dc502c16-e25f-4699-a8a2-e25148681839",
        "processData": "1",
        "applicantsCount": 37,
        "acceptedApplicants": 0,
        "rejectedApplicants": 0,
        "onHoldApplicants": 0,
        "pendingApplicants": 37
    }
}
```

### Get applicants in a specific scholarship program
- URL
  - /campaigns/{campaign_id}/applicants
- Method
  - GET
- query parameter (not mandatory)
  - status as accepted/rejected/onhold/pending,
  - nama as string,
  - statusRumah as valid/invalid,
  - provinsi as string,
  - pageNumber as string
- Response (might be different depend on the query used)
```
{
    "error": false,
    "message": "All applicants successfully fetched",
    "campaign": "Beasiswa Narasi",
    "listApplicants": [
        {
            "id": "LAZdm6hB0Pd2D6IJQiqr",
            "photoURL": "https://api.typeform.com/responses/files/fd5jfhdys69b37fec677esssd7aa1d1d234b87927c8d1b3e3efaaac693c1e1f2bf69d/1.png",
            "name": "Ahmad",
            "provinsi": "Sumatera Utara",
            "kota": "Deli Serdang",
            "universitasAtauSekolah": "Universitas negeri medan",
            "score": 400,
            "statusApplicant": "pending",
            "statusData": "valid",
            "statusRumah": "valid",
            "page": 1
        },
        {
            "id": "bGUNE7Z8mMYxeg6VmzTj",
            "photoURL": "https://api.typeform.com/responses/files/ce25d6c6cc9cd46sfsags8e7f581785f3b83d8s0aa16846209e24535e841cdsd37e/34234.PNG",
            "name": "Alfian",
            "provinsi": "Jawa Timur",
            "kota": "Situbondo",
            "universitasAtauSekolah": "Universitas Pembangunan Nasional",
            "score": 400,
            "statusApplicant": "pending",
            "statusData": "valid",
            "statusRumah": "valid",
            "page": 1
        },
        {
            "id": "qYMkAaivaVfZq00d6dy1",
            "photoURL": "https://api.typeform.com/responses/files/6ae2da003452c998db03jjsuw772ys5f1d97351a9b738438399813138fbe42f1cfc6/sda.PNG",
            "name": "Sri",
            "provinsi": "Riau",
            "kota": "Siak",
            "universitasAtauSekolah": "STAI SUSHA Siak",
            "score": 360,
            "statusApplicant": "pending",
            "statusData": "valid",
            "statusRumah": "valid",
            "page": 1
        }
}
```

### Activating process Data for a campaign
- URL
    - /campaigns/{ID_CAMPAIGN}/applicants/processData
- Method
    - POST
- URL Parameter
    - id_campaign as string
- Response
If successfully trigger processData for the first time
 ```
 {
    error: false,
    message: "All data has already fetched and created"
 }
 ```
 If successfully trigger processData other than the fist time
 (if no new applicants in sheet)
 ```
 {
    error: false,
    message: "No new applicant(s)"
 }
 ```
 (if there's at least 1 new applicant in sheet)
 ```
 {
    error: false
    message: 'All new applicant already fetched" 
 }
 ```
 
 ### Downloading all accepted applicants data
 - URL
    - /campaigns/{ID_CAMPAIGN}/downloadResult
 - Method
    - GET
 - URL parameter
    - campaign id as string
 - Response
 ```
 {
    "error": false,
    "fileDownload": [
        "https://storage.googleapis.com/kitabisa-schlrship-filter.appspot.com/test/ApplicantsTest_Beasiswa%20Narasi_2022514.csv?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-dditc%40a.iam.gserviceaccount.com%2F20220614%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=22222233444112527Z&X-Goog-Expires=1&X-Goog-SignedHeaders=host&X-Goog-Signature=89b5a74bc3bd73251923d1d3a4bd93429131f9cajjd7777djskaii2js92hf0jsd83nfg823bnf8823bf82kf923829f342ffcf8b83f1ea28dc1554bae9bd5a9fe2f3fc82820cf1d2204cfaedf8063a6ed3ac56476f34555749833cb3c44419b431a1e30f968fd05491ce31b19698c09a27711e976acbc8e855d79a9fe4352628aeafd84806a508f41d5d930e691e980d48b94b514e6544ecfdb105b7ad5894fab9be26d5fc29a1"
    ]
}
 ```

## Applicants
### Get specific applicants detail
- URL
  - /applicants?id=INSERT_APPLICANT_ID
- Method
  - GET
- URL parameter
  - id as string
- Response
```
{
    "error": false,
    "message": "Data successfully fetched",
    "fetchedData": {
        "bioDiri": {
            "nama": "tono test",
            "provinsi": "DKI Jakarta",
            "kotaKabupaten": "banten",
            "alamat": "jl barbar bisa sini",
            "NIK": "1234",
            "fotoKTP": "https://api.typeform.com/responses/files/testestsetsetse/25cd9e5f7071_IMG_20210623_184143.jpg",
            "fotoDiri": "https://api.typeform.com/responses/files/testestestset/Screenshot_2022_06_13_214203.png",
            "sosmedAcc": "@ganteng_sekali",
            "noTlp": "12345"
        },
        "bioPendidikan": {
            "tingkatPendidikan": "Kuliah",
            "jurusan": "UNJA-Ilmu Hukum-2019",
            "NIM": "1234",
            "universitasAtauSekolah": "UNJA-Ilmu Hukum-2019",
            "fotoKTM": "https://api.typeform.com/responses/files/awfawh89awfha/efe37906aabc_16245050903863625666765027345210.jpg",
            "fotoIPKAtauRapor": "https://api.typeform.com/responses/files/testeteststset/b508a428f29f_16245049661723965463954321859754.jpg"
        },
        "pengajuanBantuan": {
            "kebutuhan": "Biaya Penunjang Kuliah/Sekolah",
            "totalBiaya": "4000000",
            "fotoBuktiTunggakan": "https://api.typeform.com/responses/files/df839a46f30a45cb3f4e240/test.pdf",
            "ceritaPenggunaanDana": "ini cerita",
            "kepemilikanRumah": "Sewa",
            "fotoRumah": "https://api.typeform.com/responses/files/73f823b8823gf8b2d738e12/45ac7079bf69_20201009_103024.jpg"
        },
        "motivationLetter": {
            "ceritaLatarBelakang": "ini cerita",
            "ceritaPerjuangan": "ini cerita",
            "ceritaPentingnyaBeasiswa": "ini cerita",
            "ceritakegiatanYangDigeluti": "Sini cerita",
            "fotoBuktiKegiatan": "https://api.typeform.com/responses/files/52096be7ca908f6e52ad0c4e7/f01da66aa0da_PhotoGrid_Plus_1629435302510.jpg"
        },
        "scoreApplicant": {
            "total": 230,
            "scoreRumah": 10,
            "scoreProvinsi": 10,
            "scorePerjuangan": 10,
            "scorePenting": 10,
            "scoreNIK": 10,
            "scoreMedsos": 10,
            "scoreLatarBelakang": 50,
            "scoreKota": 10,
            "scoreKepemilikanRumah": 10,
            "scoreKegiatan": 50,
            "scoreDana": 50
        },
        "statusApplicant": "pending",
        "statusData": "invalid",
        "statusRumah": "invalid",
        "lampiranTambahan": "",
        "misc": {
            "beasiswaTerdaftar": "Beasiswa Narasi"
        },
        "reviewer": "",
        "notes": ""
    }
}
```

### Update specific applicant status
- URL
    - /applicants/{ID_APPLICANT}/update
- Method
    - POST
- URL parameter
    - ID_APPLICANT as string
- Request Parameter
    - status as string
    - notes as string
    - reviewer as string
