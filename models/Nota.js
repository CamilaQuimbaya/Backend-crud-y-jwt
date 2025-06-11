const mongoose = require('mongoose');

const notaSchema = mongoose.Schema({
    fecha:{
        type: Date,
        default: Date.now
    },
    titulo:{
        type: String,
        required:true
    },
    nota:{
        type:String, 
        required:true
    }
})

module.exports = mongoose.model('Nota', notaSchema);