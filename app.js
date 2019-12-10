// App es el punto de entrada de nuestro servidor

// REQUIRES
var express = require('express')
const mongoose = require('mongoose')


// INICIALIZAR VARIABLES
var app = express()

// DB connect
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err
    console.log('Conexion a base de datos exitosa')
})

// ROUTES
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        msg: 'Peticion realizada correctamente'
    })
})

// LISTEN REQUEST ON PORT
app.listen(3000, () => console.log('express server running on port: \x1b[32m%s\x1b[0m', '3000'))