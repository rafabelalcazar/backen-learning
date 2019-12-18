// REQUIRES
const express = require('express')

// Import models
var Hospital = require('../models/hospital')
var Doctor = require('../models/doctor')
var User = require('../models/usuario')

var app = express()

app.get('/all/:search', (req, res, next) => {

    const search = req.params.search
    var regExp = new RegExp(search, 'i')

    Promise.all([
        searchHospitals(regExp),
        searchDoctors(regExp)
    ]).then(respuesta => {
        res.status(200).json({
            ok: true,
            hospitals: respuesta[0],
            doctors: respuesta[1]
        })
    })
})

app.get('/collection/:table/:search', (req, res) => {
    const table = req.params.table
    const search = req.params.search
    var regExp = new RegExp(search, 'i')

    switch (table) {
        case 'hospital':
            searchHospitals(regExp).then(hospitals => {
                res.status(200).json({
                    ok: true,
                    hospitals
                })
            })
            break;

        case 'doctor':

            searchDoctors(regExp).then(doctors => {
                res.status(200).json({
                    ok: true,
                    doctors
                })
            })


            break;
        case 'user':

            searchUsers(regExp).then(users => {
                res.status(200).json({
                    ok: true,
                    msg: 'hola',
                    users
                })
            })

            break;

        default:
            res.status(200).json({
                ok: true,
                table,
                msg: 'Tabla no encontrada',
                search
            })
            break;
    }



})

function searchHospitals(regExp) {

    return new Promise((resolve, reject) => {

        Hospital.find({ name: regExp }, (err, hospitals) => {

            if (err) {
                reject('Error al cargar hospitales', err)
            } else {
                resolve(hospitals)
            }
        })
    })
}

function searchDoctors(regExp) {

    return new Promise((resolve, reject) => {

        Doctor.find({ name: regExp }, (err, doctors) => {

            if (err) {
                reject('Error al cargar doctores', err)
            } else {
                resolve(doctors)
            }
        })
    })
}

function searchUsers(regExp) {

    return new Promise((resolve, reject) => {

        User.find({ nombre: regExp }, 'nombre email role')
            .exec((err, users) => {

                if (err) {
                    reject('Error al cargar usuarios', err)
                } else {
                    resolve(users)
                }
            })
    })
}

module.exports = app