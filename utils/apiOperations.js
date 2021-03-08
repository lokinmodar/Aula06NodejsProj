const fetch = require("node-fetch");
const dbOps = require("./dbOperations");

async function getCharacter(id) {
  // puxa dados da swapi pelo id:
  return await fetch(`https://swapi.dev/api/people/${id}`)
    .then((res) => res.json())
    .then(async (json) => {
      const { name, gender, homeworld, species, url } = json;
      let speciesCheck;
      // como há um erro na swapi com personagens da espécie humana, verificamos se species está vazio e alteramos de acordo
      if (!Array.isArray(species) || !species.length) {
        speciesCheck = ["http://swapi.dev/api/species/1/"];
      } else {
        speciesCheck = species;
      }

      // chamando operação de inserção no banco
      dbOps.open();
      const fields = await dbOps.insertCharacter(
        id,
        name,
        gender,
        homeworld,
        speciesCheck,
        url
      );
      console.log(fields);

      //chamando operação de exibição dos dados no endpoit pela consulta ao banco
      dbOps.open();
      const queryResult = dbOps.queryCharacter(id);
      return queryResult;
    })
    .then((queryResult) => queryResult);
}

module.exports = getCharacter;
