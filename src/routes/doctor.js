const express = require('express')
var mdwareAuth = require('../middlewares/auth')

var app = express()

var Doctor = require('../models/doctor')

// GET ALL DOCTORS
app.get('/', (req, res) => {
    const offset = Number(req.query.offset || 0)
    Doctor.find({}, (err, doctors) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al cargar doctores',
                    errors: err
                })
            }
            Doctor.countDocuments({}, (err, total) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'Error al contar doctores',
                        errors: err
                    })
                }
                res.status(200).json({
                    ok: true,
                    msg: 'Listar Doctores',
                    doctors,
                    total
                })

            })
        }).populate('user', 'nombre email').populate('hospital')
        .limit(5)
        .skip(offset) //desde
})

// CREATE A DOCTOR
app.post('/', mdwareAuth.validateToken, (req, res) => {
    const { name, img, hospital } = req.body

    var doctor = new Doctor({
        name,
        img,
        user: req.usuario._id,
        hospital
    })

    doctor.save((err, doctorCreated) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al crear doctor',
                errors: err
            })
        }
        res.status(200).json({
            ok: true,
            msg: 'Doctor creado',
            doctorCreated
        })
    })
})

// UPDATE A DOCTOR
app.put('/:id', mdwareAuth.validateToken, (req, res) => {

    const id = req.params.id
    const { name, img, hospital } = req.body
        // console.log(id);

    Doctor.findById(id, (err, doctor) => {
        // TODO: RESOLVE ERROR UPDATING
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al actualizar doctor',
                errors: err
            })
        }
        if (!doctor) {
            return res.status(400).json({
                ok: false,
                msg: `El doctor con el id ${id} no existe`
            })
        }

        doctor.name = name
        doctor.img = img
        doctor.user = req.usuario._id
        doctor.hospital = hospital

        doctor.save((err, doctorUpdated) => {
            if (err) {
                return res.status(500).json({
                    ok: 'false',
                    msg: 'Error al actualizar doctor, probablemente el hospital ya no existe',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                msg: 'Doctor actualizado',
                doctorUpdated
            })
        })
    })
})

// DELETE A DOCTOR
app.delete('/:id', mdwareAuth.validateToken, (req, res) => {

    const id = req.params.id

    Doctor.findByIdAndDelete(id, (err, doctorDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al eliminar doctor',
                errors: err
            })
        }
        if (!doctorDeleted) {
            return res.status(400).json({
                ok: false,
                msg: 'El doctor no existe',
                errors: err
            })
        }
        res.status(200).json({
            ok: true,
            msg: 'Doctor eliminado',
            doctorDeleted
        })
    })
})

module.exports = app