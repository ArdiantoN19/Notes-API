/* eslint-disable operator-linebreak */
const ClientError = require("../../exceptions/ClientError");
const { response } = require("../../utils/helpers");

class CollaborationsHandler {
  constructor(collaborationsService, notesService, validator) {
    this._collaborationsService = collaborationsService;
    this._notesService = notesService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { noteId, userId } = request.payload;

      await this._notesService.verifyNoteOwner(noteId, credentialId);
      const collaborationId =
        await this._collaborationsService.addCollaboration(noteId, userId);
      return h
        .response({
          status: "success",
          message: "Kolaborasi berhasil ditambahkan",
          data: { collaborationId },
        })
        .code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return response(h, error.statusCode, "fail", error.message);
      }

      console.error(error);
      return response(
        h,
        500,
        "fail",
        "Maaf terjadi kesalahan dari server kami"
      );
    }
  }

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { noteId, userId } = request.payload;

      await this._notesService.verifyNoteOwner(noteId, credentialId);
      await this._collaborationsService.deleteCollaboration(noteId, userId);

      return {
        status: "success",
        message: "Kolaborasi berhasil dihapus",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return response(h, error.statusCode, "fail", error.message);
      }

      console.error(error);
      return response(
        h,
        500,
        "fail",
        "Maaf terjadi kesalahan dari server kami"
      );
    }
  }
}

module.exports = CollaborationsHandler;
