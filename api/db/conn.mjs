import { MongoClient } from "mongodb";
const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error("MONGODB_URI is not set");
}
console.log(`Connecting using ${connectionString}`)
const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
  console.log("Connected to the database");
} catch(e) {
  console.error(e);
  process.exit(1);
}
let db = conn.db("routes");
export default db;