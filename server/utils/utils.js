import util from "util";
import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

export const execPromise = util.promisify(exec);

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

export async function getAllTodos(pathToDB) {
  const SQL = "SELECT todo FROM todos;";

  const { stdout, stderr } = await execPromise(`sqlite3 ${pathToDB} '${SQL}'`);

  if (stderr) {
    _LOG({ message: `Error getting all todos: ${stderr}`, type: "error" });
    return [null, stderr];
  }

  const formattedData = stdout.trim().split("\n");

  return [formattedData, null];
}

export async function createTodo(pathToDB, todo) {
  const SQL = `INSERT INTO todos(todo) VALUES ('${todo}')`;

  const { stdout, stderr } = await execPromise(`sqlite3 ${pathToDB} '${SQL}'`);

  if (stderr) {
    _LOG({ message: `Error getting all todos: ${stderr}`, type: "error" });
    return [null, stderr];
  }

  const formattedData = stdout.trim().split("\n");

  return [formattedData, null];
}
