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
    2. [Post to add new campaign](#post-to-add-new-campaign)
    3. [Get specific scholarship program details](#get-specific-scholarship-program-details)
    4. [Get all applicants in a specific scholarship program](#get-all-applicants-in-a-specific-scholarship-program)
    5. [*Getting all rejected applicants from specific scholarship program](#getting-all-rejected-applicants-from-specific-scholarship-program)
    6. [*Getting all accepted applicants from specific scholarship program](#getting-all-accepted-applicants-from-specific-scholarship-program)
    7. [Search applicant by name in a specific campaign](#search-applicant-by-name-in-a-specific-campaign)
    8. [Activating process Data for a campaign](#activating-process-data-for-a-campaign)
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
{
    "error": false,
    "message": "Data successfully fetched",
    "listCampaign": [
        {
            "id": "2MITdua2vK5LlRpfN0jo",
            "name": "Beasiswa Narasi",
            "penggalangDana": "Narasi",
            "photoUrl": "https://campuspedia.id/news/wp-content/uploads/2021/08/Beasiswa-Celengan-Narasi.jpg",
            "SnK": "Beasiswa Narasi akan disalurkan hanya untuk kepentingan biaya pendidikan (UKT, SKS) atau penunjang pendidikan (skripsi, penelitian, dll)., Beasiswa Narasi hanya untuk membantu kebutuhan pendidikan mahasiswa tingkat S1 di Perguruan Tinggi Negeri (PTN) dan Perguruan Tinggi Swasta (PTS), Calon penerima beasiswa berstatus mahasiswa aktif, Nominal biaya pendidikan maupun penunjang pendidikan yang dapat diajukan oleh mahasiswa maksimal Rp 10.000.000 (sepuluh juta rupiah), Setiap kandidat yang terpilih mendapatkan beasiswa bersedia untuk diangkat profilnya di media sosial Narasi dan Kitabisa."
        },
        {
            "id": "EMvR1B7Y4xVWNrYtAYpY",
            "name": "Test",
            "penggalangDana": "test",
            "photoUrl": "test",
            "SnK": "Data dummy"
        },
        {
            "id": "fwZUBXt4d1vAobiNpnhq",
            "name": "campaign lainnya",
            "penggalangDana": "abcede",
            "photoUrl": "asasa.png",
            "SnK": "Data dummy"
        },
        {
            "id": "guVZ1HkTajrqH7of5rEo",
            "name": "test",
            "penggalangDana": "test",
            "SnK": "notes pertama"
        }
    ]
}
```

### Post to add new campaign
- URL
    - /campaigns
- Method
    - POST
- Request parameter
    - namaBeasiswa as string
    - penggalanDana as string
    - SnK as string
    - photoURL as string
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
        "photoUrl": "https://campuspedia.id/news/wp-content/uploads/2021/08/Beasiswa-Celengan-Narasi.jpg",
        "applicantsCount": 8,
        "acceptedApplicants": 1,
        "rejectedApplicants": 4,
        "onHoldApplicants": 3
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
    "campaign": "Beasiswa Narasi",
    "listApplicants": [
        {
            "id": "J9iYN3uhsj6EKztz36L5",
            "photoURL": "https://i.pinimg.com/736x/8e/d6/88/8ed688dd8f994687d33e435f0d54501a.jpg",
            "name": "Randy Hanjaya",
            "provinsi": "Banten",
            "kota": "Tangerang",
            "university": "Belum ada di dummy om datanya",
            "score": 310,
            "statusApplicant": "rejected",
            "statusData": "valid",
            "statusRumah": "valid"
        },
        {
            "id": "2HXvNWt3zH3RXQUS05Nm",
            "photoURL": "https://drive.google.com/open?id=1VttBNnvBvpwRAe3oFyTmqUPfC3EtGEEE",
            "name": "Sarah agustina",
            "provinsi": "Bandung",
            "kota": "Bandung",
            "university": "Belum ada di dummy om datanya",
            "score": 270,
            "statusApplicant": "accepted",
            "statusData": "valid",
            "statusRumah": "valid"
        },
        {
            "id": "7JI2YAbi0FaciZKVQK7v",
            "photoURL": "https://drive.google.com/open?id=1VttBNnvBvpwRAe3oFyTmqUPfC3EtGEEE",
            "name": "Agus Putra Hendrawan",
            "provinsi": "Bali",
            "kota": "Denpasar",
            "university": "Belum ada di dummy om datanya",
            "score": 270,
            "statusApplicant": "onhold",
            "statusData": "valid",
            "statusRumah": "invalid"
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

### Activating process Data for a campaign
- URL
    - /campaigns/{ID_CAMPAIGN}/applicants/processData
- Method
    - GET
- URL Parameter
    - id_campaign as string

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
   {
    "error": false,
    "message": "Data successfully fetched",
    "fetchedData": {
        "bioDiri": {
            "nama": "Agus Putra Hendrawan",
            "provinsi": "Bali",
            "kotaKabupaten": "Denpasar",
            "alamat": "Jl Rumah Agus Blok 1",
            "NIK": "5555444455556666",
            "fotoKTP": "https://drive.google.com/open?id=16BL03S4AV94gr6KfsGuwpLoVqoK4DQ8t",
            "fotoDiri": "https://drive.google.com/open?id=1VttBNnvBvpwRAe3oFyTmqUPfC3EtGEEE",
            "sosmedAcc": "@agushusky",
            "noTlp": "Belum ada di dummy om datanya"
        },
        "bioPendidikan": {
            "tingkatPendidikan": "Kuliah",
            "jurusan": "Informatika",
            "NIM": "190710193",
            "NPSN": "Belum ada di dummy om datanya",
            "fotoKTM": "https://drive.google.com/open?id=1MYljcGUbV9-3N6xor5k6BI3-ER-FtWUf",
            "fotoIPKAtauRapor": "https://drive.google.com/open?id=1cN9-QY2HyFSJHovBc9qQJuNGWJxa1gCO"
        },
        "pengajuanBantuan": {
            "kebutuhan": "Biaya penunjang kuliah/sekolah",
            "totalBiaya": "5000000",
            "fotoBuktiTunggakan": "https://drive.google.com/open?id=1-7k2GkEbkn1CNPBVrePgnurcEhaDxGrT",
            "ceritaPenggunaanDana": "Rencana penggunaan dana dituliskan untuk menginformasikan rincian dari pencairan dana yang ingin Anda cairkan. Hal tersebut berguna pada saat pencairan dana telah disetujui, rencana penggunaan dana tersebut akan secara otomatis muncul di halaman galang dana pada menu Kabar Terbaru sebagai bentuk transparansi dana kepada publik, terutama pihak donatur.\n\nRencana penggunaan dana wajib dituliskan campaigner (penggalang dana) saat melakukan pengajuan pencairan dana, baik pada campaign dengan kategori medis (bantuan kesehatan) maupun campaign dengan kategori non-medis (bantuan lainnya). Rencana peggunaan dana yang dituliskan harus jelas dan terperinci dan harus sesuai dengan tujuan galang dana yang dibuat.",
            "kepemilikanRumah": "Milik Sendiri",
            "fotoRumah": "https://drive.google.com/open?id=1q-sNSfXlbf4TYxiXkUe2kaDrcb0462MW"
        },
        "motivationLetter": {
            "ceritaLatarBelakang": "Pria itu selalu saja begitu, kerjaannya begadang sampai larut dan cuma memperbaiki barang rongsok yang bukan miliknya. Mendengar suaranya saja sudah bikin tidak tenang banyak orang, entah bagaimana, yang jelas suaranya cukup nyaring di dengar dari dalam rumah.\n\n“pak sudah malam ini, cepatan masuk rumah, gak enak sama tetangga.” kata ibuku.\n\nRumahku berada di pinggir jalan gang tidak terlalu lebar. Dalam rumah kami, tidak ada tempat buat menyimpan semua barang milik ayahku, tepatnya barang milik temannya.\n\nIbuku sering marah kepada ayah karena perbuatannya yang sering sekali tidak tidur. Tak jarang juga pada pagi hari terdengar celoteh yang kurang enak untuk didengar anak-anaknya sepertiku.\n\nTapi apa boleh buat, begitulah kebiasaan ayahku.\n\nDia memperbaiki becak motor milik teman-temannya. Bukan hanya satu-dua, melainkan ada 3 sampai lima becak yang berserakan di depan rumah kami.\n\nDan kenapa aku bilang itu adalah barang rongsokan, karena beberapa hari lagi pasti becak itu akan datang kerumah kami memohon untuk diperbaiki. Aku tidak begitu mengerti dan memperhatikannya, cuman setiap hari aku lihat becak-becak itu, setidaknya aku tau mana yang sudah pernah datang dan mana yang belum.",
            "ceritaPerjuangan": "Sering dari becak yang diperbaiki ayahku adalah becak yang sama, dan itu-itu saja. Aku pun hafal, bahkan siapa yang datang juga aku tau dia pemilik becak rongsok yang mana.\n\nKebiasaannya buruk yang sering dilakukan itu membuat tubuhnya lemah. Dia sering sekali sakit-sakitan. Batuknya yang tak henti dalam satu dua minggu, nafas yang sedikit ngos-ngosan, asma sih enggak, mungkin saking kecapeannya.\n\nUntuk menghidupi anaknya, ibuku membantu perekonomian keluarga dengan jualan gorenang setiap harinya. Ayahku sendiri hanya tukang becak motor dan petani kecil. Jadi setelah dia begadang atau hanya tidur dalam waktu 1-2 jam, lalu dia pergi ke sawah dan mengurus ladangnya.Tapi bila tidak musim tanam atau panen, maka ayahku pergi ke pankalan becak untuk mencari pelanggan.\n\nSayangnya tak ada pelanggan yang mau menaiki becak motor milik ayahku. Memang aku akui dan juga ibu pun begitu, bahwa becak motor milik ayahku tak layak ditumpangi oleh orang. Mungkin jelek dan rusaknya karena dibuat untuk membawa kelapa kering milik bosnya untuk diantarkan ke para pelanggan pemilik kelapa tersebut.",
            "ceritaPentingnyaBeasiswa": "Iya, ayahku pengantar kelapa tua. Itu pun cuma jika setiap ada kelapa yang datang, biasa 3 hari sekali. Dari situlah ayahku benar-benar mendapat upah untuk menghidupi keluarga.\n\nLantas bagaimana dengan barang rongsok yang selalu dikerjakannya setiap malam, yang susah payah dia bela-bela tidak tidur hanya untuk memperbaiki barang-barang tersebut?\n\nKalau kalian tau, semua yang dia kerjakan untuk becak motor rongsok itu “TIDAK di BAYAR“.\n\nKetika aku mendengar kabar tersebut dari ibuku, aku juga ikut jengkel, marah, kesal apa sajalah. Kenapa coba dia rela bela-belain memperbaiki becak rongsok milik temannya yang pada ujung-ujungnya tidak mendapat apa-apa?\n\nKenapa juga sih dia merelakan kesehatanya hanya untuk orang yang tidak memikirkannya. Pernah aku menjumpai dia benar-benar sakit. Tubuhnya sangat lemas, batuknya sudah gak karuan nada dan iramanya, menyakitkan dada orang tersebut. Dia hanya bisa berbaring lemas untuk jangka waktu beberapa hari.",
            "ceritakegiatanYangDigeluti": "Sejenak aku berfikir, mungki dia lebih baik diberi sakit dari Sang Kuasa, dengan begitu dia bisa istirahat. Mungkin juga dari sakit itu dia sadar, kalau yang dia lakukan itu tidak baik untuk kesehatannya. Toh juga apa yang ia lakukan tidak mendapat apa-apa.\n\nTapi pikiranku salah besar, apa yang telah terjadi kepadanya tidak membuatnya berubah sama sekali. Saat dia sudah sedikit bugar, cuma sedikit saja, dia melakukan aktifitas itu lagi dan lagi.\n\nSampai kapan dia akan melakukan hal itu? Aku kesal dengan berbuatanya, aku bukan benci, cuma kalau melihat salah seorang yang kusayang seperti itu, lantas aku harus bagaimana? aku juga bingung, ibu saja tidak bisa menasehatinya, apa lagi aku?\n\nDi suatu pagi yang seisi rumah ribut oleh ocehan ayah-ibuku, aku mendengar ucapan mereka yang lantang dengan suara saling meninggi,\n\n“pak bagaimana nasib anak kita, kalau bapak begini terus, penghasilan pas-pasan dan tidak cari kerja lain. Masih saja mengurus becak orang yang tidak mendapakan upah. Sedangkan anak kita sudah masuk kelas 3 SMA, habis ini butuh dana banyak untuk ujianya” kata ibuku berusa halus.",
            "fotoBuktiKegiatan": "https://drive.google.com/open?id=1MFDmX6T-xB1DjpqePfNOUBZ1hRK8K7CR"
        },
        "statusApplicant": "rejected",
        "statusData": "invalid",
        "statusRumah": "invalid",
        "lampiranTambahan": "https://drive.google.com/open?id=1K_CEyInlqcswIA1BGEjt1GKURVC9OZmz",
        "misc": {
            "beasiswaTerdaftar": "2MITdua2vK5LlRpfN0jo"
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
