const response = require("../../utils/helpers");

class NotesHandler {
  constructor(service) {
    this._service = service;
    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  postNoteHandler(request, h) {
    try {
      const { title = "untitled", tags, body } = request.payload;
      const noteId = this._service.addNote({ title, tags, body });
      return response(
        h,
        201,
        "success",
        "Catatan berhasil ditambahkan",
        noteId
      );
    } catch (error) {
      return response(h, 400, "fail", error.message);
    }
  }

  getNotesHandler(_request, h) {
    const notes = this._service.getNotes();
    return response(h, 200, "success", "", notes);
  }

  getNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const note = this._service.getNoteById(id);
      return response(h, 200, "success", "", note);
    } catch (error) {
      return response(h, 404, "fail", error.message);
    }
  }

  putNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { title, tags, body } = request.payload;
      const note = this._service.editNoteById(id, { title, tags, body });
      return response(h, 200, "success", "Catatan berhasil diperbarui", note);
    } catch (error) {
      return response(h, 404, "fail", error.message);
    }
  }

  deleteNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      this._service.deleteNoteById(id);
      return response(h, 200, "success", "Catatan berhasil dihapus");
    } catch (error) {
      return response(h, 404, "fail", error.message);
    }
  }
}

module.exports = NotesHandler;
