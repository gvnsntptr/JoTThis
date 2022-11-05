const util = require('util');
const fs = require('fs');

//  https://www.npmjs.com/package/uuid
const uuidv1 = require('uuid/v1');

const fileReadAsync = util.promisify(fs.readFile);
const fileWriteAsync = util.promisify(fs.writeFile);

class StoreData {
  read() {
    return fileReadAsync('db/db.json', 'utf8');
  }

  write(note) {
    return fileWriteAsync('db/db.json', JSON.stringify(note));
  }

  getNotes() {
    return this.read().then((notes) => {
      let parsed;

      try {
        parsed = [].concat(JSON.parse(notes));
      } catch (err) {
        parsed = [];
      }

      return parsedNotes;
    });
  }

  addNote(note) {
    const { title, text } = note;

    if (!title || !text) {
      throw new Error("Note 'title' and 'text' cannot be blank");
    }

 
    const newNote = { title, text, id: uuidv1() };

    return this.getNotes()
      .then((notes) => [...notes, newNote])
      .then((updatedNotes) => this.write(updatedNotes))
      .then(() => newNote);
  }

  removeNote(id) {
    return this.getNotes()
      .then((notes) => notes.filter((note) => note.id !== id))
      .then((filteredNotes) => this.write(filteredNotes));
  }
}

module.exports = new StoreData();