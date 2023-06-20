require("dotenv").config();
const { Pool } = require("pg");

const db = {
  port: process.env.PGPORT,
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
};

const pool = new Pool(db);
module.exports = pool;
// (async () => {
// const query = {
//   text: "update karyawan set nama_lengkap = ($1) where id = ($2) returning *",
//   values: ["budi aja", "K0002"],
// };
// const { rows } = await pool.query("select * from notesapp");
//   const { rows } = await pool.query(query);
// console.log(rows);
// })();
