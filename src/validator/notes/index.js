const InvariantError = require("../../exceptions/InvariantError");
const { NotePayloadSchema } = require("./schema");

const NotesValidator = {
  validateNotePayload: (payload) => {
    const { error, value } = NotePayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
    return value;
  },
};

module.exports = NotesValidator;
