("use strict");

const mysql = require("mysql");

const fetch = require("node-fetch");



const Hapi = require("@hapi/hapi");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return {
        now: new Date(Date.now()).toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        }),
        message: "Tuc de Tuc!",
      };
    },
  });

  server.route({
    method: "GET",
    path: "/person/{id?}",
    handler: (request, h) => {

      getPerson(request.params.id);
      const user = getPerson(request.params.id)
        ? request.params.id
        : "Aluno Accenture";
      return `Hello ${user}`;
    },
  });

  server.route({
    method: "GET",
    path: "/query",
    handler: (request, h) => {
      const queryParam = request.query;

      return { value: queryParam };
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

function getPerson(id) {
  fetch(`https://swapi.dev/api/people/${id}`)
    .then((response) =>  {
      if (!response.ok) {
        throw new Error(`Person of id ${id} not found`);
      } else {
        return response.json();
      }
    })
    .then((person) => {
      const species = person.species;
      const homeUrl = person.homeworld;
      const films = person.films;
      const vehicles = person.vehicles;
      const starships = person.starships;
      fetch(homeUrl)
        .then((response) => response.json())
        .then((world) => {
          person.homeworld = world.name;
        })
        .catch((err) => console.log(err));
      Promise.all(
        films.map((url) => fetch(url).then((response) => response.json()))
      )
        .then((data) => {
          data.forEach((films, index) => (person.films[index] = films.title));
          Promise.all(
            vehicles.map((url) =>
              fetch(url).then((response) => response.json())
            )
          )
            .then((data) => {
              data.forEach(
                (vehicles, index) => (person.vehicles[index] = vehicles.name)
              );
              Promise.all(
                starships.map((url) =>
                  fetch(url).then((response) => response.json())
                )
              )
                .then((data) => {
                  data.forEach(
                    (starships, index) =>
                      (person.starships[index] = starships.name)
                  );
                  Promise.all(
                    species.map((url) =>
                      fetch(url).then((response) => response.json())
                    )
                  )
                    .then((data) => {
                      data.forEach(
                        (species, index) =>
                          (person.species[index] = species.name)
                      );
                      console.log(person);
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}
/* 
try {
  getPerson(20);
} catch (error) {
  console.log("My error:" + error);
} */
