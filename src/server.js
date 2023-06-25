require("dotenv").config();

const Hapi = require("@hapi/hapi");
// const NotesService = require("./services/inMemory/NotesService");
const NotesService = require("./services/postgres/NotesService");
const notes = require("./api/notes");
const NotesValidator = require("./validator/notes");
const users = require("./api/users");
const UsersValidator = require("./validator/users");
const UsersService = require("./services/postgres/UsersService");

const init = async () => {
  const notesService = new NotesService();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.NODE_ENV !== "production" ? process.env.HOST : "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server sedang berjalan di ${server.info.uri}`);
};

init();
