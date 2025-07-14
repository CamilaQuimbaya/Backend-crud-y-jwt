const mongoose = require('mongoose');

const notaSchema = mongoose.Schema({
    fecha: {
        type: Date,
        default: Date.now
    },
    titulo: {
        type: String,
        required: true
    },
    nota: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    background: {
    type: String,
    default: 'bg-default' // puedes definir clases CSS como valores
    },

     usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});


module.exports = mongoose.model('Nota', notaSchema);