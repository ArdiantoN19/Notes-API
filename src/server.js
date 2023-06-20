require("dotenv").config();

const Hapi = require("@hapi/hapi");
// const NotesService = require("./services/inMemory/NotesService");
const NotesService = require("./services/postgres/NotesService");
const notesPlugin = require("./api/notes");
const NotesValidator = require("./validator/notes");

const init = async () => {
  const notesService = new NotesService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.NODE_ENV !== "production" ? process.env.HOST : "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register({
    plugin: notesPlugin,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  });

  await server.start();
  console.log(`Server sedang berjalan di ${server.info.uri}`);
};

init();
