const response = (h, statusCode, status, message, data = []) => {
  return h.response({ status, message, data }).code(statusCode);
};

module.exports = response;
