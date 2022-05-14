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
5. [Applicants](#applicants)
    1. [Get specific applicants detail](#get-specific-applicants-detail)
    2. [Search applicant by name](#search-applicant-by-name)
    3. [Update specific applicant status](#update-specific-applicant-status)

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
        "id": "yCJOWYTvcsCEY3JFHk0Y",
        "name": "Randy",
        "photoUrl": "abcde.jpg",
        "email": "randy123@gmail.com",
        "university": "UMN",
        "jurusan": "TK",
        "angkatan": "2019",
        "provinsi": "Banten",
        "kota": "Tangerang",
        "kecamatan": "Test",
        "kelurahan": "Test",
        "alamat": "Test",
        "nim": "123456",
        "nik": "654321",
        "phoneNumber": "0989823124",
        "sosmedAcc": "Randy3939",
        "status": "accepted",
        "essay": {
            "answer": "Jawaban Dummy Jawaban Dummy Jawaban Dummy Jawaban Dummy Jawaban Dummy Jawaban Dummy Jawaban Dummy Jawaban Dummy Jawaban Dummy ",
            "question": "Pertanyaan dummy?"
        },
        "jenisBantuan": "Dana",
        "jumlahBiaya": "10.000.000",
        "deadlinePembayaran": "12/7/2022",
        "kebutuhanPenunjang": [
            "Makan",
            "minuman"
        ],
        "rincianBiayaPenunjang": [
            {
                "amount": "100.000",
                "title": "makanan"
            },
            {
                "minuman": "50.000",
                "title": "minuman"
            }
        ],
        "images": [
            {
                "imageUrl": "abcde.png",
                "title": "Foto Rumah"
            }
        ]
    }
}
```

### Search applicant by name
- URL
  - /applicants/search
- Method
  - GET
- Request body
  - name as string
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
