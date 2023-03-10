import pkg from "pg";
import dotenv from "dotenv"

dotenv.config()
const { Pool } = pkg;


const databaseconfig = {
    connectionString: process.env.DATABASE_URL,
    ssl:true,
}

const connection = new Pool(
    databaseconfig
);

export default connection;