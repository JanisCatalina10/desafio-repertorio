const express = require('express');
const cors = require('cors');
const fs = require ('fs');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;
const FILE_PATH = 'repertorio.json';

const leerRepertorio = () => {
    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
};

const guardarRepertorio = (data) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
};

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
});

//obteter canciones
app.get("/canciones", (req, res) => {
    res.json(leerRepertorio())
});

//Agregar una nueva canción
app.post("/canciones", (req, res) => {
    const repertorio = leerRepertorio();
    const nuevaCancion = req.body;

    if (!nuevaCancion.id || !nuevaCancion.titulo || !nuevaCancion.artista || !nuevaCancion.tono) {
        return res.status(400).send("Todos los campos son obligatorios");
    }

    repertorio.push(nuevaCancion);
    guardarRepertorio(repertorio);
    res.send("Canción agregada con éxito");
});

//Editar una canción
app.put("/canciones/:id", (req, res) => {
    const repertorio = leerRepertorio();
    const {id} = req.params;
    const cancionEditada = req.body;

    const index = repertorio.findIndex((c) => c.id == id);
    if (index !== -1) {
        repertorio[index] = { ...repertorio[index], ...cancionEditada };
        guardarRepertorio(repertorio);
        res.send("Canción actualizada con éxito");
    } else {
        res.status(404).send("Canción no encontrada");
    }
});

app.delete("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const repertorio = leerRepertorio();
    const index = repertorio.findIndex(c => c.id == id);

    if (index === -1) {
        return res.status(404).send("Canción no encontrada");
    }
    repertorio.splice(index, 1);

    guardarRepertorio(repertorio);
    res.send("Canción eliminada con éxito");
});

//Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});


