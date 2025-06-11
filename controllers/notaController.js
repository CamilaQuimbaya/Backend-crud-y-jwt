const Nota = require('../models/Nota');

// Create a new note
exports.crearNota = async(req, res) =>{
    try {
        let data_nota = new Nota(req.body);
        await data_nota.save();
        res.send(data_nota);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error al crear la nota' });
    }
}

exports.obtenerNotas = async(req, res) => {
    try {
        const data_notas = await Nota.find();
        res.json(data_notas);
    } catch (error) {
        console.log(error);
        res.status(500).send({message: 'Error al obtener las notas'});
    }
}

exports.obtenerNotaPorId = async(req, res) => {
    try {
        const data_nota = await Nota.findById(req.params.id)
        if(!data_nota){
            res.status(404).json({message: 'Nota no encontrada'});
        }

        res.json(data_nota);
    } catch (error) {
        console.log(error);
        res.status(500).send({message: 'Error al obtener la nota'});
    }
}


exports.actualizarNota = async(req, res) => {
    try {
        const {titulo, nota} = req.body
        let data_nota = await Nota.findById(req.params.id);

        if(!data_nota){
            return res.status(404).json({message: 'Nota no encontrada'});
        }

        //actualizar esos campos de esa nota

        data_nota = await Nota.findByIdAndUpdate(
            {_id: req.params.id},
            {titulo, nota},
            {new: true } // Devuelve el objeto actualizado
        );

        res.json(data_nota);
    } catch (error) {
        console.log(error);
        res.status(500).send({message: 'Error al actualizar la nota'});
    }
}

exports.eliminarNota = async(req, res) => {
    try {
        const data_nota = await Nota.findById(req.params.id);
        if(!data_nota){
            return res.status(404..json({message: 'Nota no encontrada'}))
        }
        await Nota.findByIdAndDelete(req.params.id);
        res.json({message: 'Nota eliminada correctamente'})
    } catch (error) {
        console.log(error);
        res.status(500).send({message: 'Error al eliminar la nota'});
    }
}