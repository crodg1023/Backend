require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Note = require('./models/note');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Give a password as argument');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullsatck:${password}@cluster0.kpfeqpu.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
});

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Note = mongoose.model('Note', noteSchema);

const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method);
    console.log('Path: ', request.path);
    console.log('Body: ', request.body);
    console.log('-----');
    next();
}

//app.use(requestLogger);
morgan.token('body', (req) => {
    return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'));

//== NOTAS ==//

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
];

const generateID = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
    return maxId + 1;
}

app.get('/', (request, response) => {
    response.send('<h1>Hello world</h1>');
});

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => response.json(notes));
});

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);

    note ? response.json(note) : response.status(404).end();
});

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);

    response.status(204).end();
});

app.post('/api/notes', (request, response) => {
    const body = request.body;

    if (!body.content) {
        return response.status(400).json({ error: 'Content missing...' });
    }

    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateID()
    }

    console.log(note);
    console.log('Content-Type: ', request.get('Content-Type'));

    notes = notes.concat(note);
    response.json(note);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


//== AGENDA ==//
/*
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateID = () => {
    return Math.floor(Math.random() * 100);
}

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${ persons.length } people</p><p>${ new Date() }</p>`);
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);

    person ? response.json(person) : response.status(404).end();
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);

    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const id = generateID();

    if (!request.body.name || !request.body.number) {
        return response.status(400).json({ error: 'There must exist name and number' });
    }

    if (persons.find(p => p.name === request.body.name)) {
        return response.status(404).json({ error: 'Name must be unique' });
    }

    const person = {
        id,
        name: request.body.name,
        number: request.body.number
    }

    persons = persons.concat(person);
    response.json(person);
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' });
}

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
*/