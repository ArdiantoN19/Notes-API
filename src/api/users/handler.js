const ClientError = require("../../exceptions/ClientError");
const { response } = require("../../utils/helpers");

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);
      const userId = await this._service.addUser(request.payload);
      return h
        .response({
          status: "success",
          message: "User berhasil ditambahkan",
          data: { userId },
        })
        .code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({ status: "fail", message: error.message })
          .code(error.statusCode);
      }

      console.error(error);
      return response(
        h,
        500,
        "error",
        "Maaf, terjadi kegagalan pada server kami."
      );
    }
  }

  async getUserByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const user = await this._service.getUserById(id);
      return h.response({ status: "success", data: { user } }).code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({ status: "fail", message: error.message })
          .code(error.statusCode);
      }

      console.error(error);
      return response(
        h,
        500,
        "error",
        "Maaf, terjadi kegagalan pada server kami."
      );
    }
  }

  async getUsersByUsernameHandler(request, h) {
    try {
      const { username = "" } = request.query;
      const users = await this._service.getUsersByUsername(username);
      // return h.response({ status: "success", data: { users } }).code(200);
      return {
        status: "success",
        data: {
          users,
        },
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
        "Maaf, terjadi kesalahan pada server kami"
      );
    }
  }
}

module.exports = UsersHandler;
