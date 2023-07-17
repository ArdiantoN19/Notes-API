const ClientError = require("../../exceptions/ClientError");

class ExportNoteHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
  }

  async postExportNotesHandler(request, h) {
    try {
      this._validator.validateExportNotesPayload(request.payload);

      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
      };

      await this._service.sendMessage("export:notes", JSON.stringify(message));

      return h
        .response({
          status: "success",
          message: "Permintaan Anda dalam antrean",
        })
        .code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);
      }

      console.log(error);
      return h
        .response({
          status: "fail",
          message: "Maaf terjadi kesalahan pada server kami",
        })
        .code(500);
    }
  }
}

module.exports = ExportNoteHandler;
