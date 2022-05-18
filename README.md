# API usage guide
> API still in development, change to be made

## Table of contents
1. [Endpoint](#endpoint) 
2. [Login](#login)
3. [Users](#users)
    1. [Adding new user](#adding-new-user)
    2. [Get specific user](#getting-specific-user)
4. [Campaigns](#campaigns)
    1. [Get all available campaigns](#get-all-available-campaigns)
    2. [Get specific scholarship program details](#get-specific-scholarship-program-details)
    3. [Get all applicants in a specific scholarship program](#get-all-applicants-in-a-specific-scholarship-program)
    4. [Getting all rejected applicants from specific scholarship program](#getting-all-rejected-applicants-from-specific-scholarship-program)
    5. [Getting all accepted applicants from specific scholarship program](#getting-all-accepted-applicants-from-specific-scholarship-program)
    6. [Search applicant by name in a specific campaign](#search-applicant-by-name-in-a-specific-campaign)
5. [Applicants](#applicants)
    1. [Get specific applicants detail](#get-specific-applicants-detail)
    2. [Update specific applicant status](#update-specific-applicant-status)

## Endpoint
https://kitabisa-test-app.herokuapp.com

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
            "name": "Beasiswa B",
            "penggalangDana": "test2",
            "photoUrl": "test2"
        },
        {
            "id": "EMvR1B7Y4xVWNrYtAYpY",
            "name": "Test",
            "penggalangDana": "test",
            "photoUrl": "test"
        }
    ]
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
        "name": "Beasiswa B",
        "penggalangDana": "test2",
        "photoUrl": "test2",
        "applicantsCount": 3,
        "acceptedApplicants": 2,
        "rejectedApplicants": 1
    }
}
```

### Get all applicants in a specific scholarship program
- URL
  - /campaigns/{campaign_id}/applicants
- Method
  - GET
- URL parameter
  - id as string
- Response
```
{
    "error": false,
    "message": "All applicants successfully fetched",
    "listApplicants": [
        {
            "id": "yCJOWYTvcsCEY3JFHk0Y",
            "name": "Randy",
            "university": "UMN",
            "status": "accepted"
        },
        {
            "id": "rE62vnIjU1XwE6l1f7mR",
            "name": "Alvin",
            "university": "UMN",
            "status": "accepted"
        },
        {
            "id": "GrJmUfLpodd1puYULRqT",
            "name": "Sarah",
            "university": "ITB",
            "status": "rejected"
        }
    ]
}
```

### Getting all rejected applicants from specific scholarship program
- URL
  - /campaigns/{campaign_id}/rejected
- Method
  - GET
- URL parameter
  - id as string
- Response
```
{
    "error": false,
    "message": "Fetched all rejected applicants",
    "listApplicants": [
        {
            "id": "GrJmUfLpodd1puYULRqT",
            "name": "Sarah",
            "university": "ITB",
            "status": "rejected"
        }
    ]
}
```

### Getting all accepted applicants from specific scholarship program
- URL
  - /campaigns/{campaign_id}/accepted
- Method
  - GET
- URL parameter
  - id as string
- Response
```
{
    "error": false,
    "message": "Fetched all rejected applicants",
    "listApplicants": [
        {
            "id": "rE62vnIjU1XwE6l1f7mR",
            "name": "Alvin",
            "university": "UMN",
            "status": "accepted"
        },
        {
            "id": "yCJOWYTvcsCEY3JFHk0Y",
            "name": "Randy",
            "university": "UMN",
            "status": "accepted"
        }
    ]
}
```

### Search applicant by name in a specific campaign
- URL
  - /campaigns/{id_campaigns}/applicants/{search_string}
- Method
  - GET
- Request parameter
  - id_campaigns as string 
  - search_string as string
- Response
```
{
    "error": false,
    "message": "Search result",
    "listApplicants": [
        {
            "id": "M79hhdRa9DEptBpXR4qZ",
            "name": "RaNdy Sukarto",
            "university": "IPB",
            "status": "rejected"
        },
        {
            "id": "yCJOWYTvcsCEY3JFHk0Y",
            "name": "Randy",
            "university": "UMN",
            "status": "accepted"
        }
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
        "id": "eAluEkpXgizZFJ7ZR3KJ",
        "nim": "'162012533027",
        "nik": "3671091001020002",
        "ajuanPenunjangPendidikan": "",
        "alamat": "Jalan Batu 2 No.41, RT 003/RW 016, Cibodas, Cibodasari, Tangerang, Banten",
        "buktiIP": "https://api.typeform.com/responses/files/dc6a6ca4dda85e6be4d1e087fe7ac59968353ce58ea37305a42f531f92a2e240/KHS_Semester_2.pdf",
        "buktiIPK": "https://api.typeform.com/responses/files/bda11f45a7fb6249c12bbc41f2a20549eaf488d4b72896fa26eead7c8c40de6b/KRS_FINAL.pdf",
        "currIP": "",
        "deadlineUKT": "9/28/0021",
        "dokumenApplicant": "https://api.typeform.com/responses/files/70b752f1438da8c4c119d05e36cb7cf1f8b4bb206d5e92fc35451a2185057f50/Lampiran_Beasiswa_Narasi_TV__FAJAR_JANUAR_AULIA.pdf",
        "email": "fajar.januar.aulia-2020@stmm.unair.ac.id",
        "essayKegiatan": "Saya mengikuti kepanitaan OSPEK Fakultas Teknologi Maju dan Multidisipin, sebagai anggota divisi Acara yang mengkonsepkan bagaimana OSPEK itu berlangsung. Selain itu, saya mengikuti kegiatan KMMI (Kredensial Mikro Mahasiswa Indonesia) dengan mata ajar yaitu Eksplorasi dan Visualisasi Data. Selebih itu, saya belajar melalui buku \"Bercerita dengan data\" dari Knaflic untuk menggeluti bidang data sains dan bagaimana cara mengolah data.",
        "essayKondisi": "Di masa pandemi seperti ini, ayah saya mengalami pemotongan gaji hampir lebih dari 50 persen akibat sektor pariwisata tempat ia bekerja, kapal pesiar (sebagai laundry attendant / TKI). Ditambah mayoritas pendapatan ayah saya didapat dari uang tip yang diberikan oleh pelanggannya. Ditambah kondisi ibu saya yang sakit-sakitan akibat stress yang dideritanya karena pandemi yang berkepanjangan ini, cukup menguras tabungan kami sekeluarga. Selain itu, rumah kami yang dimakan rayap juga menambah kekhawatiran kami akan hidup aman, namun apa daya tidak ada yang bisa kami lakukan karena tidak mempunyai uang yang cukup untuk memberesinya, uangnya terpakai untuk biaya pendidikan saya. Hal ini membuat saya berpikir untuk mencari beasiswa ke mana-mana.  Walaupun saya telah berhasil untuk meminta direktorat keuangan dari Universitas untuk menurunkan UKT, dari 8 Juta rupiah menjadi 6 Juta rupiah, tapi tetap hal ini masih memberatkan orang tua saya terutama di masa pandemi seperti ini. Saya harap dengan mendaftar Beasiswa Narasi ini saya dapat meringkankan beban kedua orang tua saya.",
        "essayPenting": "Sangatlah penting, sebagai anak yang berbakti dan anak yang menyayangi orang tuanya. Membantu meringankan beban ayah dan mama merupakan hal yang membahagiakan. Dengan mendapatkan beasiswa ini dapat membantu meningkatkan semangat kuliah saya, dan membuat saya fokus untuk kuliah dan meningkatkan diri menjadi lebih baik lagi. Berpacu untuk belajar, tidak memikirkan masalah keuangan keluarga.",
        "fotoEssayKegiatan": "https://api.typeform.com/responses/files/d98c78604a38fc7bfb2ae94e195f1fc55b11c1f451126bef8d4fb13b3984fe17/Screenshot__31__dikonversi.pdf",
        "fotoRumah": "https://api.typeform.com/responses/files/863c78a513e9208cb9cc62a6cc0457b86f31561dc16c9723d943dbe19b2b7340/IMG_20210812_084932_325.pdf",
        "jenisBantuan": "Biaya pendidikan (UKT, SKS)",
        "kecamatan": "Cibodasari",
        "kotaKabupaten": "Kota Tangerang",
        "lamaranBeasiswa": "Beasiswa Narasi",
        "name": "Fajar Januar Aulia",
        "noTlp": "'+6289644536754",
        "proposalTunjanganBiaya": "",
        "provinsi": "Banten",
        "rincianTunjangan": "",
        "sosmedAcc": "Instagram @Xyzornsian",
        "status": "accepted",
        "submittedAt": "9/5/2021 7:12:58",
        "suratRekomendasiDosen": "",
        "token": "a3320ndp7myjqtbm7a3320nd6mgdvnqq",
        "totalIPK": "",
        "uktDanSemester": "Rp4.000.000 untuk Semester 3",
        "university": "Universitas Airlangga - Teknik Industri - 2020"
    }
}
```

### Update specific applicant status
- URL
  - /applicants/{applcants_id}/update
- Method
  - GET
- URL parameter
  - id as string
- Request Body
  - status as string (only 'rejected','accepted' or '' allowed)
- Response
```
{
    "error": false,
    "message": "Status updated"
}
```
When sending other than 'rejected','accepted' or '' as request body
```
{
    "error": true,
    "message": "Wrong Data"
}
```
