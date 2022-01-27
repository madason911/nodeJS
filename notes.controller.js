const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const notesPath = path.join(__dirname, "db.json");

async function addNote(title) {
  const notes = await getNotes();
  const note = {
    title,
    id: Date.now().toString(),
  };

  notes.push(note);

  await saveNotes(notes);
  console.log(chalk.bgGreen("Note was added!"));
}

async function getNotes() {
  const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function saveNotes(notes) {
  await fs.writeFile(notesPath, JSON.stringify(notes));
}

async function printNotes() {
  const notes = await getNotes();

  console.log(chalk.bgBlue("Here is the list of notes:"));
  notes.forEach((note) => {
    console.log(chalk.blue(note.id), chalk.blue(note.title));
  });
}

async function removeNote(id) {
  const notes = await getNotes();

  if (notes.findIndex((note) => +note.id === id) === -1) {
    console.log(chalk.bgRed("Title with such ID does not exist"));
  } else {
    await saveNotes(notes.filter((note) => +note.id !== id));
    console.log(chalk.bgRed("Note was removed!"));
  }
}

module.exports = {
  addNote,
  printNotes,
  removeNote,
};
