import util from "util";
import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const execPromise = util.promisify(exec);

const PATH_TO_DB = process.env.PATH_TO_DB;

export function _LOG({ message, type }) {
  const now = new Date().toISOString();

  switch (type) {
    case "error":
      console.error(`${now} [ERROR] ${message}`);
      break;

    default:
      console.log(`${now} [LOG] ${message}`);
      break;
  }
}

export async function getAllTodos() {
  const SQL = "SELECT todo FROM todos;";

  const { stdout, stderr } = await execPromise(
    `sqlite3 ${PATH_TO_DB} '${SQL}'`,
  );

  if (stderr) {
    _LOG({ message: `Error getting all todos: ${stderr}`, type: "error" });
    return [null, stderr];
  }

  const formattedData = stdout.trim().split("\n");

  return [formattedData, null];
}

export async function createTodo(todo) {
  const SQL = `INSERT INTO todos(todo) VALUES ('${todo}')`;

  const { stdout, stderr } = await execPromise(
    `sqlite3 ${PATH_TO_DB} '${SQL}'`,
  );

  if (stderr) {
    _LOG({ message: `Error getting all todos: ${stderr}`, type: "error" });
    return [null, stderr];
  }

  const formattedData = stdout.trim().split("\n");

  return [formattedData, null];
}
