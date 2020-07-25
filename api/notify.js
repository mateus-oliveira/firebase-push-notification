const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://fir-notification-df4d9.firebaseio.com',
});

const registrationToken =
    'fIVbGVKeS8-MUhaCKnA9f6:APA91bHs39-iwsazqEQtg6pYXAkFzcyqHvrH1apTu5rSmr8EPj_jMT5WuNrPJVmbftiMMYzDa3Q1JwuAR6U_3cQ3PKVEhxEyGfv1Eaup24if_Lj45OacxzLYMuVShrsR3JbnghiYJaYd';

const message = {
    notification: {
        title: 'QUALQUER COISA',
        body: 'ESDRAS é LINDO E CONVENCIDO E ENGANADO',
    },
    token: registrationToken,
};

admin
    .messaging()
    .send(message)
    .then((response) => console.log('Successfully sent message:', response))
    .catch((error) => console.log('Error sending message:', error));
