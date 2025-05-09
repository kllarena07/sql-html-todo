import { getAllTodos, createTodo, execPromise } from "./utils.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Go up one level to the server directory where .env is located
const serverDir = path.dirname(__dirname);

dotenv.config({ path: path.join(serverDir, ".env") });

const PATH_TO_TEST_DB = process.env.PATH_TO_TEST_DB;

async function initTestDB() {
  const SQL = `
    CREATE TABLE todos (
      id INTEGER PRIMARY KEY,
      todo TEXT NOT NULL
    );
  `;

  const { stderr } = await execPromise(
    `sqlite3 ${PATH_TO_TEST_DB} '${SQL}'`,
  );

  if (stderr) {
    _log(`Error getting all todos: ${stderr}`, "error");
  }
}
initTestDB();
