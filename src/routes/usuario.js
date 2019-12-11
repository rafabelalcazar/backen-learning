const express = require('express')
const bcrypt = require('bcryptjs')
var mdwareAuth = require('../middlewares/auth')
var app = express()

var Usuario = require('../models/usuario')

// GET ALL USERS
app.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre email role img').exec(
        (err, users) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error cargando usuarios',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                msg: 'Get users',
                users
            })
        }
    )
})

// CREATE A NEW USER
app.post('/', mdwareAuth.validateToken, (req, res) => {
    var body = req.body

    var user = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        img: body.img,
        role: body.role
    })

    user.save((err, userCreated) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al crear usuario',
                errors: err
            })
        }

        userCreated.password = ':)'

        res.status(201).json({
            ok: true,
            msg: 'user created',
            userCreated,
            userToken: req.usuario
        })
    })
})

// UPDATE USER
app.put('/:id', (req, res) => {
    const id = req.params.id
    var { nombre, email, role } = req.body

    Usuario.findById(id, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al buscar usuario',
                errors: err
            })
        }
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: `El usuario con el id ${id} no existe`,
                errors: { message: 'No existe un usuario con ese ID' }
            })

        }

        user.nombre = nombre
        user.email = email
        user.role = role

        user.save((err, userSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al actualizar usuario',
                    errors: err
                })
            }
            userSaved.password = ':)'

            res.status(200).json({
                ok: true,
                msg: 'user updated',
                user: userSaved

            })
        })
    })
})

// DELETE USER
app.delete('/:id', (req, res) => {

    id = req.params.id

    Usuario.findByIdAndRemove(id, (err, userRemoved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al eliminar usuario',
                errors: err
            })
        }
        if (!userRemoved) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe este usuario',
                errors: { message: 'No existe un usuario con ese id' }
            })
        }

        userRemoved.password = ':)'

        res.status(200).json({
            ok: true,
            msg: 'user removed',
            user: userRemoved

        })
    })
})
module.exports = app