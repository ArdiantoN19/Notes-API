const ClientError = require("../../exceptions/ClientError");
const { response } = require("../../utils/helpers");

class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  async postNoteHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);
      const { title = "untitled", tags, body } = request.payload;

      const { id: credentialId } = request.auth.credentials;

      const noteId = await this._service.addNote({
        title,
        body,
        tags,
        owner: credentialId,
      });
      return response(h, 201, "success", "Catatan berhasil ditambahkan", {
        noteId,
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return response(h, error.statusCode, "fail", error.message);
      }

      // Server Error
      console.error(error);
      return response(
        h,
        500,
        "error",
        "Maaf, terjadi kegagalan pada server kami."
      );
    }
  }

  async getNotesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const notes = await this._service.getNotes(credentialId);
    return h
      .response({
        status: "success",
        data: { notes },
      })
      .code(200);
  }

  async getNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyNoteOwner(id, credentialId);

      const note = await this._service.getNoteById(id);
      return h
        .response({
          status: "success",
          data: { note },
        })
        .code(200);
      // return response(h, 200, "success", "", note);
    } catch (error) {
      if (error instanceof ClientError) {
        return response(h, error.statusCode, "fail", error.message);
      }
      // Server Error
      console.error(error);
      return response(
        h,
        500,
        "error",
        "Maaf, terjadi kegagalan pada server kami."
      );
    }
  }

  async putNoteByIdHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);
      const { id } = request.params;

      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyNoteOwner(id, credentialId);

      await this._service.editNoteById(id, request.payload);

      return h
        .response({
          status: "success",
          message: "Catatan berhasil diperbarui",
        })
        .code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        return response(h, error.statusCode, "fail", error.message);
      }

      // Server error
      console.error(error);
      return response(
        h,
        500,
        "error",
        "Maaf, terjadi kegagalan pada server kami."
      );
    }
  }

  async deleteNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyNoteOwner(id, credentialId);
      await this._service.deleteNoteById(id);
      return h
        .response({
          status: "success",
          message: "Catatan berhasil dihapus",
        })
        .code(200);
      // return response(h, 200, "success", "Catatan berhasil dihapus");
    } catch (error) {
      if (error instanceof ClientError) {
        return response(h, error.statusCode, "fail", error.message);
      }

      // Server error
      console.error(error);
      return response(
        h,
        500,
        "error",
        "Maaf, terjadi kegagalan pada server kami."
      );
    }
  }
}

module.exports = NotesHandler;
