const response = (h, statusCode, status, message, data = []) => {
  if (statusCode > 300) {
    return h.response({ status, message }).code(statusCode);
  }
  return h.response({ status, message, data }).code(statusCode);
};

module.exports = response;
