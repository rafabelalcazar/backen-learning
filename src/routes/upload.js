const express = require('express')
const fileUpload = require('express-fileupload')

var app = express()

app.use(fileUpload())


app.put('/:table/:id', (req, res, next) => {

    var { table, id } = req.params
    console.log(table, id);

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            msg: 'No se subió ningun archivo, de seleccionar una imagen',
        })
    }

    var image = req.files.image
    var ext = image.mimetype.split('/')[1]
        // console.log(ext);

    // Extensiones validas

    var validExt = ['png', 'jpg', 'gif', 'jpeg']

    if (!validExt.includes(ext)) {
        return res.status(400).json({
            ok: false,
            msg: 'Extension no valida, usar archivos ' + validExt.join(', '),
        })
    }
    // Validar el peso de la imagen
    if (image.size > 5000000) {
        return res.status(400).json({
            ok: false,
            msg: 'El archivo debe pesar menos de 5MB',
        })
    }

    var path = `./src/uploads/${image.name}`
        // console.log(path);

    image.mv(path, err => {
        // console.log(err);
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al mover archivo',
            })
        }

        res.status(200).json({
            ok: true,
            msg: 'Imagen subida correctamente'
        })



    })





})

module.exports = app