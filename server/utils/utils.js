/**
 * @module utils
 * @description Utility functions for the Todo application, including:
 *  - Database operations for todos (create, get all)
 *  - Logging utilities
 *  - Promisified exec for running shell commands
 */
import util from "util";
import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

/**
 * Promisified version of child_process.exec
 * @function execPromise
 * @description Allows exec to be used with async/await instead of callbacks
 * @param {string} command - The shell command to execute
 * @returns {Promise<{stdout: string, stderr: string}>} A promise that resolves with stdout and stderr
 * @example
 * const { stdout, stderr } = await execPromise('ls -la');
 */
export const execPromise = util.promisify(exec);

/**
 * Standardized logging function
 * @function _log
 * @description Logs messages with timestamps and log level indicators
 * @param {string} message - The message to log
 * @param {('error'|'warn'|'info'|'log')} [type='log'] - The type of log
 * @returns {void}
 * @example
 * _log('Operation successful', 'info');
 * _log('Something went wrong', 'error');
 */
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

/**
 * Retrieves all todos from the database
 * @async
 * @function getAllTodos
 * @description Queries the SQLite database to retrieve all todos
 * @param {string} pathToDB - Path to the SQLite database file
 * @returns {Promise<[Array<{id: number, todo: string}>|null, string|null]>} A promise that resolves with [data, error]
 *   where data is an array of todo objects when successful (null on error)
 *   and error contains error message when failed (null on success)
 * @example
 * const [todos, error] = await getAllTodos('/path/to/database.db');
 * if (error) {
 *   console.error('Failed to get todos:', error);
 * } else {
 *   console.log('Todos:', todos);
 * }
 */
export async function getAllTodos(pathToDB) {
  const SQL = "SELECT id, todo FROM todos;";

  // Use -json flag to get JSON formatted output from sqlite3
  const { stdout, stderr } = await execPromise(`sqlite3 -json ${pathToDB} '${SQL}'`);

  if (stderr) {
    _log(`Error getting all todos: ${stderr}`, "error");
    return [null, stderr];
  }

  let formattedData = [];
  try {
    // Parse the JSON output from sqlite3
    formattedData = JSON.parse(stdout);
    
    // Ensure id is a number
    formattedData = formattedData.map(item => ({
      id: Number(item.id),
      todo: item.todo
    }));
  } catch (error) {
    _log(`Error parsing todos: ${error.message}`, "error");
    return [null, error.message];
  }

  return [formattedData, null];
}

/**
 * Creates a new todo in the database
 * @async
 * @function createTodo
 * @description Inserts a new todo into the SQLite database
 * @param {string} pathToDB - Path to the SQLite database file
 * @param {string} todo - The todo text to insert
 * @returns {Promise<[Array<string>|null, string|null]>} A promise that resolves with [data, error]
 *   where data contains operation output when successful (null on error)
 *   and error contains error message when failed (null on success)
 * @example
 * const [result, error] = await createTodo('/path/to/database.db', 'Buy groceries');
 * if (error) {
 *   console.error('Failed to create todo:', error);
 * } else {
 *   console.log('Todo created successfully');
 * }
 */
export async function createTodo(pathToDB, todo) {
  const SQL = `INSERT INTO todos(todo) VALUES ('${todo}');`;

  const { stdout, stderr } = await execPromise(`sqlite3 ${pathToDB} "${SQL}"`);

  if (stderr) {
    _log(`Error creating todo: ${stderr}`, "error");
    return [null, stderr];
  }

  const formattedData = stdout.trim().split("\n");

  return [formattedData, null];
}
