const Database = require("better-sqlite3");

const db = new Database("owpm.db");

function setup() {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS accounts (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      email           TEXT NOT NULL,
      password        TEXT NOT NULL,
      battle_tag      TEXT NOT NULL
    );`,
  ).run();
}

function get(query, ...args) {
  return db.prepare(query).all(...args);
}

function getFirst(query, ...args) {
  return db.prepare(query).get(...args);
}

function insert(query, ...args) {
  db.prepare(query).run(...args);
}

function update(query, ...args) {
  db.prepare(query).run(...args);
}

module.exports = {
  setup,
  get,
  getFirst,
  insert,
  update,
};
