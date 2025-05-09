import util from "util";
import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

export const execPromise = util.promisify(exec);

export function _log(message, type = "log") {
  const now = new Date().toISOString();
  const types = {
    error: { method: console.error, label: "ERROR" },
    warn: { method: console.warn, label: "WARN" },
    info: { method: console.info, label: "INFO" },
    log: { method: console.log, label: "LOG" },
  };

  const logType = types[type] || types.log;
  logType.method(`${now} [${logType.label}] ${message}`);
}

export async function getAllTodos(pathToDB) {
  const SQL = "SELECT todo FROM todos;";

  const { stdout, stderr } = await execPromise(`sqlite3 ${pathToDB} '${SQL}'`);

  if (stderr) {
    _log(`Error getting all todos: ${stderr}`, "error");
    return [null, stderr];
  }

  const formattedData = stdout.trim().split("\n");

  return [formattedData, null];
}

export async function createTodo(pathToDB, todo) {
  const SQL = `INSERT INTO todos(todo) VALUES ('${todo}')`;

  const { stdout, stderr } = await execPromise(`sqlite3 ${pathToDB} '${SQL}'`);

  if (stderr) {
    _log(`Error getting all todos: ${stderr}`, "error");
    return [null, stderr];
  }

  const formattedData = stdout.trim().split("\n");

  return [formattedData, null];
}
