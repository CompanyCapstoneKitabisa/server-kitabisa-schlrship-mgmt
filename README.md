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
        "id": "KWoaqHDcweHL8X3ez5wn",
        "name": "Azimatul Kuroma",
        "NIK": "123456789",
        "provinsi": "Jawa Timur",
        "kotaKabupaten": "Blitar",
        "kecamatan": "Sananwetan",
        "kelurahan": "Plosokerep",
        "alamat": "Jl. tangkuban no 199",
        "noPonsel": "'+6289513275884",
        "email": "arsfgm3229@gmail.com",
        "sosmedAcc": "arsza_zim3392",
        "university": "Universitas Indonesia",
        "NIM": "2086206077",
        "jurusan": "Teknik Informatika",
        "IP": "3.5",
        "IPK": "3.75",
        "jumlahBiayaUKT": "1.000.000",
        "deadlinePembayaran": "7/14/0021",
        "kebutuhan1": "makan",
        "biayaKebutuhan1": "1.000.000",
        "kebutuhan2": "minum",
        "biayaKebutuhan2": "500.000",
        "ceritaKondisi": "alhamdulillah masih ada,pekerjaan wiraswasta,kurang biaya kuliah,ada yang sudah putus sekolah",
        "ceritaSeberapaPenting": "sangat penting untuk biaya perkuliahan setiap semester",
        "fotoKegiatan": "https://api.typeform.com/responses/files/test/foto_kls.jpg",
        "fotoRumah": "https://api.typeform.com/responses/files/test/rumah.jpg",
        "statusKepemilikanRumah": "Milik Sendiri",
        "buktiIPK": "",
        "buktiIP": "",
        "KTM": "https://kemahasiswaan.poltekkes-mks.ac.id/wp-content/uploads/2019/03/kta-2.png",
        "KTP": "https://1.bp.blogspot.com/-0_alFR0_Xfg/XLT-8mT0uUI/AAAAAAAAAHE/IZ9Qx70u4fok6pVAsXy2l563WuyArz7rwCLcBGAs/s1600/KTP-1544523262.png",
        "lampiranDokumen": "https://api.typeform.com/responses/files/test/Lampiran_Dokumen_Beasiswa_Narasi_Bantuan_Pendidikan_NEW.pdf"
    }
}
```
