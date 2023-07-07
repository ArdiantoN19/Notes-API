/* eslint-disable operator-linebreak */
const ClientError = require("../../exceptions/ClientError");
const { response } = require("../../utils/helpers");

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationPayload(request.payload);

      const { username, password } = request.payload;
      const id = await this._usersService.verifyUsersCredential(
        username,
        password
      );

      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      await this._authenticationsService.addRefreshToken(refreshToken);

      return h
        .response({
          status: "success",
          message: "Authentication berhasil ditambahkan",
          data: { accessToken, refreshToken },
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
        "Maaf terjadi kegagalan pada server kami"
      );
    }
  }

  async putAuthenticationHandler(request, h) {
    try {
      this._validator.validatePutAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = this._tokenManager.generateAccessToken({ id });

      return h
        .response({
          status: "success",
          message: "Access Token berhasil diperbarui",
          data: {
            accessToken,
          },
        })
        .code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        return response(h, error.statusCode, "fail", error.message);
      }

      console.error(error);
      return response(
        h,
        500,
        "fail",
        "Maaf terjadi kegagalan pada server kami"
      );
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);

      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return h
        .response({
          status: "success",
          message: "Refresh token berhasil dihapus",
        })
        .code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        return response(h, error.statusCode, "fail", error.message);
      }

      console.error(error);
      return response(
        h,
        500,
        "fail",
        "Maaf terjadi kegagalan pada server kami"
      );
    }
  }
}

module.exports = AuthenticationsHandler;
