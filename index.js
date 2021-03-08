const Hapi = require("@hapi/hapi");
const getCharacter = require("./utils/apiOperations");
const queryAllCharacters = require("./utils/dbOperations").queryAllCharacters;

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  // rota principal que lista todos os usuários cadastrados
  server.route({
    method: "GET",
    path: "/",
    handler: async (request, h) => {
      return await queryAllCharacters();
    },
  });

  // rota que lista usuário pelo id fornecido
  server.route({
    method: "GET",
    path: "/person/{id?}",
    handler: async (request, h) => {
      const response = await getCharacter(request.params.id);
      console.log("Saved data: \n", response);
      return { person: response };
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
