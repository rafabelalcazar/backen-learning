// REQUIRES
const express = require('express')
const mdwareAuth = require('../middlewares/auth')

// Import model
var Hospital = require('../models/hospital')

var app = express()

// GET ALL HOSPITALS
app.get('/', (req, res) => {
    const offset = Number(req.query.offset || 0)
    Hospital.find({}, (err, hospitals) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al cargar hospitales',
                    errors: err
                })
            }

            Hospital.countDocuments({}, (err, total) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'Error al contar hospitales',
                        errors: err
                    })
                }

                res.status(200).json({
                    ok: true,
                    msg: 'Listar hospitales',
                    hospitals,
                    total
                })
            })

        }).populate('user', 'nombre email')
        .limit(5)
        .skip(offset)
})

// CREATE A NEW HOSPITAL
app.post('/', mdwareAuth.validateToken, (req, res) => {
    var body = req.body

    var hospital = new Hospital({
        name: body.name,
        img: body.img,
        user: req.usuario._id,
    })

    hospital.save((err, hospitalCreated) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al crear hospital',
                errors: err
            })
        }
        res.status(201).json({
            ok: true,
            msg: 'Hospital creado',
            hospitalCreated,
        })
    })
})

// UPDATE A HOSPITAL
app.put('/:id', mdwareAuth.validateToken, (req, res) => {
    const id = req.params.id
    var { name, img } = req.body

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al actualizar hospital',
                errors: err
            })
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                msg: `El hospital con el id ${id} no existe`,
            })
        }

        hospital.name = name
        hospital.user = req.usuario._id
        hospital.img = img

        hospital.save((err, hospitalUpdated) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al actualizar hospital',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                msg: 'Hospital actualizado',
                hospitalUpdated
            })
        })
    })
})

// DELETE A HOSPITAL
app.delete('/:id', mdwareAuth.validateToken, (req, res) => {
    const id = req.params.id

    Hospital.findByIdAndDelete(id, (err, hospitalDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al eliminar hospital',
                errors: err
            })
        }
        if (!hospitalDeleted) {
            return res.status(400).json({
                ok: false,
                msg: 'El hospital no existe',
                errors: err
            })
        }
        res.status(200).json({
            ok: true,
            msg: 'Hospital eliminado',
            hospitalDeleted
        })
    })
})

module.exports = app