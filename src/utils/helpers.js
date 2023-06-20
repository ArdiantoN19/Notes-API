/* eslint-disable camelcase */
const response = (h, statusCode, status, message, data = []) => {
  if (statusCode > 300) {
    return h.response({ status, message }).code(statusCode);
  }
  return h.response({ status, message, data }).code(statusCode);
};

const mapDBToModel = ({ id, title, tags, body, created_at, updated_at }) => ({
  id,
  title,
  tags,
  body,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { response, mapDBToModel };
