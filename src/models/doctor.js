const mongoose = require('mongoose')

const Schema = mongoose.Schema

const doctorSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'Se requiere un usuario para crear doctor'] },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id de hospital es obligatorio'] }
})

module.exports = mongoose.model('Doctor', doctorSchema)