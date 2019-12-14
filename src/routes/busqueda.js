// REQUIRES
const express = require('express')

// Import models
var Hospital = require('../models/hospital')
var Doctor = require('../models/doctor')
var app = express()

app.get('/all/:search', (req, res, next) => {

    const search = req.params.search
    var regExp = new RegExp(search, 'i')

    Hospital.find({ name: regExp }, (err, hospitals) => {

        res.status(200).json({
            ok: true,
            hospitals
        })
    })

})

module.exports = app