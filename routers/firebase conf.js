const admin = require('firebase-admin');

var serviceAccount = require("../key/kitabisa-schlrship-filter-firebase-adminsdk-dditc-5801c06d31.json");

var firestore = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = firestore;