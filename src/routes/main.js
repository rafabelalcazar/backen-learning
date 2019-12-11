const express = require('express')
var app = express()
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        msg: 'Peticion realizada correctamente, servidor corriendo correctamente'
    })
})

module.exports = app