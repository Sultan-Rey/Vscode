'use strict';

let moncash = require('nodejs-moncash-sdk');
moncash.configure({
    mode: 'sandbox', //sandbox or live
    client_id: '5b9062409d5b3c9a32f11a899b827b94',
    client_secret: 'GB0oCarcbr9Pz14AoHhRnLO_0OedQlse-wc9konv42Kur-6d-WBRcbJjpQB9yjWI'
});

let create_payment_json = {
    "amount": 50,
    "orderId": "123445564454542123"
    };
    let payment_creator = moncash.payment;
    payment_creator.create(create_payment_json, function (error, payment) {
    if (error) {
    console.log(error);
    throw error;
    } else {
    console.log("Create Payment Response");
    console.log(payment_creator.redirect_uri(payment));
    }
    });
