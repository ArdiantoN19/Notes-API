const UsersHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "Users",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const usersValidator = new UsersHandler(service, validator);
    await server.route(routes(usersValidator));
  },
};
