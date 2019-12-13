const mongoose = require('mongoose')

const Schema = mongoose.Schema

const hospitalSchema = new Schema({
        name: { type: String, required: [true, 'El nombre es necesario'] },
        img: { type: String },
        user: { type: Schema.Types.ObjectId, ref: 'Usuario' }
    }
    // ,{collection: 'hospitales'} if you want to change the collection's name in the DB
)

module.exports = mongoose.model('Hospital', hospitalSchema)