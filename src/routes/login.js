const express = require('express')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var SEED = require('../../config/config').SEED
var app = express()

var Usuario = require('../models/usuario')

app.post('/', (req, res) => {

    var body = req.body

    Usuario.findOne({ email: body.email }, (err, userFound) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al buscar usuario',
                errors: err
            })
        }
        // email doesn't exist
        if (!userFound) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas',
                errors: err
            })
        }

        // wrong password
        if (!bcrypt.compareSync(body.password, userFound.password)) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas',
                errors: err
            })
        }

        userFound.password = ':)'

        // Credentials right

        // CREATE TOKEN
        // tokenActive live in hours
        const tokenActive = 3600

        var token = jwt.sign({ usuario: userFound }, SEED, { expiresIn: tokenActive })
        res.status(200).json({
            ok: true,
            msg: 'Login correcto',
            user: userFound,
            token
            // id: userFound._id

        })
    })


})

module.exports = app