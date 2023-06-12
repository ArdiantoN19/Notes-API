const Hapi = require("@hapi/hapi");
const NotesService = require("./services/inMemory/NotesService");
const notesPlugin = require("./api/notes");

const init = async () => {
  const notesService = new NotesService();

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
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
    },
  });

  await server.start();
  console.log(`Server sedang berjalan di ${server.info.uri}`);
};

init();
