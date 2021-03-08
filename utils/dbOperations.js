const mysql = require("mysql");

const dbOps = {
  open: () => {
    // criando conexão com o BD
    conn = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "123456",
      database: "swapinode",
    });
  },

  queryCharacter: (id) => {
    //consulta que lista o personagem pelo id
    return new Promise((resolve, reject) => {
      conn.connect((err) => {
        if (!err) {
          conn.query(
            `SELECT * FROM swperson WHERE swperson.id=${id}`,
            (err, result, fields) => {
              if (err) throw err;
              resolve(result[0]);
              conn.end();
            }
          );
        } else {
          reject(err);
        }
      });
    });
  },

  insertCharacter: (
    //consulta que insere novo dado de personagem no banco
    id,
    name = "Desconhecido",
    gender = "n/a",
    homeworld = "",
    species = "",
    url = ""
  ) => {
    return new Promise((resolve, reject) => {
      conn.connect((err) => {
        if (err) reject(err);
        conn.query(
          `INSERT INTO swperson values (${id}, "${name}", "${gender}", "${homeworld}", "${species}", "${url}")`,
          (err, result, fields) => {
            //se houver personagem duplicado, retona erro no console
            if (err) {
              if (err.code == "ER_DUP_ENTRY") {
                resolve(`The character with ${id} already exists!`);
              } else {
                reject(err);
              }
            }
            resolve(`The character data for ${name} was saved with ID: ${id}`);
            conn.end();
          }
        );
      });
    });
  },

  queryAllCharacters: () => {
    //consulta que lista todos os personagens salvos
    return new Promise((resolve, reject) => {
      dbOps.open();
      conn.connect((err) => {
        if (err) reject(err);
        conn.query(`SELECT * FROM swperson `, (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
          conn.end();
        });
      });
    });
  },
};

module.exports = dbOps;
