const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Give a password as argument');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullsatck:${password}@cluster0.kpfeqpu.mongodb.net/peopleApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
});

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Note = mongoose.model('Note', noteSchema);
const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 4) {
    Person
        .find({})
        .then(persons => {
            console.log('Phonebook:');
            persons.forEach(person => {
                console.log(' >', person.name, person.number);
            });
            process.exit(1);
        });
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    });
    
    person
        .save()
        .then(result => {
            console.log('Person data saved!');
            mongoose.connection.close();
        });
}



/*
const note = new Note({
    content: 'WebDev is cool',
    important: true
});

note.save().then(result => {
    console.log('Note saved!');
    mongoose.connection.close();
});
*/

/*
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note);
    });
    mongoose.connection.close();
});
*/