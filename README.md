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
        "bioDiri": {
            "nama": "Fajar Januar Aulia",
            "provinsi": "Banten",
            "kotaKabupaten": "Kota Tangerang",
            "alamat": "Jalan Teluk 2 No. 22 RT 001 RW 008",
            "NIK": "3682749911000005",
            "fotoKTP": "https://1.bp.blogspot.com/-0_alFR0_Xfg/XLT-8mT0uUI/AAAAAAAAAHE/IZ9Qx70u4fok6pVAsXy2l563WuyArz7rwCLcBGAs/s1600/KTP-1544523262.png",
            "fotoDiri": "https://i.pinimg.com/736x/8e/d6/88/8ed688dd8f994687d33e435f0d54501a.jpg",
            "sosmedAcc": "@akuTampan"
        },
        "bioPendidikan": {
            "tingkatPendidikan": "SMA",
            "jurusan": "SMA",
            "NIM": "'12483751000096",
            "fotoKTM": "https://i.pinimg.com/originals/ab/45/78/ab4578cc55a0052c625904806871337c.jpg",
            "fotoIPKAtauRapor": "https://indbeasiswa.com/wp-content/uploads/2020/02/contoh-transkrip-nilai-indbeasiswa.jpg"
        },
        "pengajuanBantuan": {
            "kebutuhan": "Biaya pendidikan (UKT, SKS)",
            "totalBiaya": "6.000.000",
            "fotoBuktiTunggakan": "https://pbs.twimg.com/media/Ch-ZkqgVIAIMA3K.jpg",
            "ceritaPenggunaanDana": "dana ini rencananya ingin saya gunakan untuk membayar biaya UKT saya untuk 3 semester",
            "kepemilikanRumah": "Milik sendiri",
            "fotoRumah": "https://storage.nu.or.id/storage/post/16_9/mid/15235888635ad01effee493.jpg"
        },
        "motivationLater": {
            "ceritaLatarBelakang": "Di masa pandemi seperti ini, ayah saya mengalami pemotongan gaji hampir lebih dari 50 persen akibat sektor pariwisata tempat ia bekerja, kapal pesiar (sebagai laundry attendant / TKI). Ditambah mayoritas pendapatan ayah saya didapat dari uang tip yang diberikan oleh pelanggannya. Ditambah kondisi ibu saya yang sakit-sakitan akibat stress yang dideritanya karena pandemi yang berkepanjangan ini, cukup menguras tabungan kami sekeluarga. Selain itu, rumah kami yang dimakan rayap juga menambah kekhawatiran kami akan hidup aman, namun apa daya tidak ada yang bisa kami lakukan karena tidak mempunyai uang yang cukup untuk memberesinya, uangnya terpakai untuk biaya pendidikan saya. Hal ini membuat saya berpikir untuk mencari beasiswa ke mana-mana.  Walaupun saya telah berhasil untuk meminta direktorat keuangan dari Universitas untuk menurunkan UKT, dari 8 Juta rupiah menjadi 6 Juta rupiah, tapi tetap hal ini masih memberatkan orang tua saya terutama di masa pandemi seperti ini. Saya harap dengan mendaftar Beasiswa Narasi ini saya dapat meringkankan beban kedua orang tua saya.",
            "ceritaPerjuangan": "kemi semua sedang berjuang untuk bisa mendapatkan hidup yang lebih baik. sejauh ini yang telah kami lakukan adalah dengan bekerja semampu kami, namun tetap saja tidak semua kebutuhan kami bisa terpenuhi. tak jarang kami harus berhutang untuk bisa memenuhi kebutuhan yang mendesak",
            "ceritaPentingnyaBeasiswa": "Harapan yang sangat besar untuk lolos menerima beasiswa dari narasi. Optimis walaupun dengan segala keterbatasan, tetapi saya yakin akan keajaiban. Mimpi yang terus saya doakan bisa terwujud. Meringankan beban orang tua saat kuliah merupakan keinginan terbesar saya. Saya ingin membuktikan bahwa faktor ekonomi bukanlah penghalang seseorang untuk meraih mimpinya,banyak inspirator yang membuka pandangan saya akan yakin dalam menggapai cita-cita. Beasiswa merupakan salah satu jalan untuk saya bisa bertahan di perkuliahan. Apalagi saya mendapatkan informasi terkait besasiwa narasi di youtube, tentunya ini menjadi kesempatan bagi saya agar bisa bersemangat lagi dalam berkuliah. Dengan usaha yang maksimal dan doa-doa dari orang tersayang yang menjadi penguat bisa menjadi jalan untuk terwujudnya mimpi,harapan serta cita-cita.",
            "fotoBuktiKegiatan": "https://infokini.news/wp-content/uploads/2020/10/IMG-20201021-WA0047.jpg"
        },
        "statusApplicant": "rejected",
        "statusData": "accepted",
        "statusRumah": "onhold",
        "lampiranTambahan": "-",
        "lembarPersetujuan": "-",
        "misc": {
            "beasiswaTerdaftar": "2MITdua2vK5LlRpfN0jo"
        },
        "notes": "applicant belum bisa diterima karena data tidak lengkap"
    }
}
```
