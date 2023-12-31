const ExportNoteHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "exports",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const exportNoteHandler = new ExportNoteHandler(service, validator);
    await server.route(routes(exportNoteHandler));
  },
};
