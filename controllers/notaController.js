const Nota = require('../models/Nota');

// Crear nota
exports.crearNota = async (req, res) => {
    try {
        const nuevaNota = new Nota({
            ...req.body,
            usuario: req.usuario.id
        });

        await nuevaNota.save();
        res.send(nuevaNota);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error al crear la nota' });
    }
};

// Obtener todas las notas del usuario
exports.obtenerNotas = async (req, res) => {
    try {
        const notas = await Nota.find({ usuario: req.usuario.id }).sort({ fecha: -1 });
        res.json(notas);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error al obtener las notas' });
    }
};

// Obtener nota por ID (solo si pertenece al usuario)
exports.obtenerNotaPorId = async (req, res) => {
    try {
        const nota = await Nota.findById(req.params.id);

        if (!nota) {
            return res.status(404).json({ message: 'Nota no encontrada' });
        }

        if (nota.usuario.toString() !== req.usuario.id) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        res.json(nota);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error al obtener la nota' });
    }
};

// Actualizar nota (solo si pertenece al usuario)
exports.actualizarNota = async (req, res) => {
  try {
    const nota = await Nota.findById(req.params.id);

    if (!nota) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    if (nota.usuario.toString() !== req.usuario.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const { titulo, nota: contenido, completed, background } = req.body;

    const notaActualizada = await Nota.findByIdAndUpdate(
      req.params.id,
      { titulo, nota: contenido, completed, background },
      { new: true }
    );

    res.json(notaActualizada);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error al actualizar la nota' });
  }
};


// Eliminar nota (solo si pertenece al usuario)
exports.eliminarNota = async (req, res) => {
    try {
        const nota = await Nota.findById(req.params.id);

        if (!nota) {
            return res.status(404).json({ message: 'Nota no encontrada' });
        }

        if (nota.usuario.toString() !== req.usuario.id) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        await Nota.findByIdAndDelete(req.params.id);
        res.json({ message: 'Nota eliminada correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error al eliminar la nota' });
    }
};
