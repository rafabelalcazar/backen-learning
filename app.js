// App es el punto de entrada de nuestro servidor

// REQUIRES
var express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

//Import routes
const appRoutes = require('./src/routes/main')
const userRoutes = require('./src/routes/usuario')
const loginRoutes = require('./src/routes/login')
const hospitalRoutes = require('./src/routes/hospital')
const doctorRoutes = require('./src/routes/doctor')


// INICIALIZAR VARIABLES
var app = express()

// MIDDLEWARE
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

// DB connect
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err
    console.log('Conexion a base de datos exitosa')
})

// ROUTES
// userRoutes
app.use('/', appRoutes)
app.use('/login', loginRoutes)
app.use('/usuario', userRoutes)

// hospitalRoutes
app.use('/hospital', hospitalRoutes)

// doctorRoutes
app.use('/doctor', doctorRoutes)


// LISTEN REQUEST ON PORT
app.listen(3000, () => console.log('express server running on port: \x1b[32m%s\x1b[0m', '3000'))