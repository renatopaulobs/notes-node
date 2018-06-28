const fs = require ('fs');
const _ = require('lodash');
const yargs = require('yargs');

const notes = require('./notes.js');
const titleOptions = {
    describe: 'Title of note',
    demand: true,
    alias: 't'
}
const bodyOptions = {
    describe: 'Body of note',
    demand: true,
    alias: 'b'
}

const argv = yargs
    .command('add', 'add a new note',{
        title: titleOptions,
        body: bodyOptions
    })
    .command('list', 'list all notes')
    .command('read', 'read a note',{
        title: titleOptions
    })
    .command('remove', 'Remove a note',{
        title: titleOptions
    })
    .help()
    .argv;

var command = process.argv[2];

if(command === 'add')
{
    var note = notes.addNote(argv.title, argv.body);
    if(note){
        console.log("Note found")
        notes.logNote(note)
    }else{
        console.log("Note Already Exists; Try another title")
    }
}
else if (command === 'list')
{
    var allNotes = notes.fetchNotes();
    console.log(`Printing ${allNotes.length} note(s).`);
    allNotes.forEach((note) => notes.logNote(note));
}
else if (command === 'read')
{
    var note = notes.getNote(argv.title)
    if(note){
        notes.logNote(note)
    }else{
        console.log("Note not found");
    }
}
else if (command === 'remove')
{
    var noteRemoved = notes.removeNote(argv.title);
    var message = noteRemoved ? 'Note was removed' : 'Note not found';
    console.log(message);
}
else
{
    console.log('Command not recognized');
}
