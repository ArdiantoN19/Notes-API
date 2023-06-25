const InvariantError = require("../../exceptions/InvariantError");
const { UserPayloadSchema } = require("./schema");

const UsersValidator = {
  validateUserPayload: (payload) => {
    const { error, result } = UserPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
    return result;
  },
};

module.exports = UsersValidator;
