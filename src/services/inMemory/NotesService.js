const { nanoid } = require("nanoid");

class NotesService {
  constructor() {
    this._notes = [];
  }

  addNote({ title, tags, body }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
      id,
      title,
      tags,
      body,
      createdAt,
      updatedAt,
    };
    this._notes.push(newNote);

    const isSuccess = this._notes.findIndex((note) => note.id === id);
    if (isSuccess === -1) throw new Error("Catatan gagal ditambahkan");
    return id;
  }

  getNotes() {
    return this._notes;
  }

  getNoteById(id) {
    const note = this._notes.findIndex((n) => n.id === id);
    if (note === -1) throw new Error("Catata tidak ditemukan");
    return this._notes[note];
  }

  editNoteById(id, { title, tags, body }) {
    const indexNote = this._notes.findIndex((note) => note.id === id);
    const updatedAt = new Date().toISOString();
    if (indexNote === -1) {
      throw new Error("Gagal memperbarui catatan. Id tidak ditemukan");
    }

    // this._notes[indexNote] = {
    //   ...this._notes[indexNote],
    //   title,
    //   tags,
    //   body,
    //   updatedAt,
    // };
    // let copyNotes = this._notes;
    this._notes = this._notes.map((note) => {
      if (note.id === id) {
        return { ...note, title, tags, body, updatedAt };
      }
      return { ...note };
    });
    return this._notes.find((note) => note.id === id);
  }

  deleteNoteById(id) {
    const indexNote = this._notes.findIndex((note) => note.id === id);
    if (indexNote === -1) {
      throw new Error("Catatan gagal dihapus. Id tidak ditemukan");
    }
    return this._notes.splice(indexNote, 1);
  }
}

module.exports = NotesService;
