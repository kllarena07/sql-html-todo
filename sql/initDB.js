import util from "util";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

export const execPromise = util.promisify(exec);

/**
 * @typedef {Object} InitDBOptions
 * @property {string} [dbPath='todos.db'] - Path to the SQLite database file
 * @property {string} [sqlFilePath='initDB.sql'] - Path to the SQL initialization file
 * @property {boolean} [verbose=false] - Whether to log additional information for debugging
 */

/**
 * Initializes the SQLite database with tables and schema defined in the SQL file
 *
 * @param {InitDBOptions} options - Configuration options for database initialization
 * @returns {Promise<void>} A promise that resolves when initialization is complete
 * @throws {Error} If the SQL file doesn't exist or if there's an error executing the SQL
 *
 * @example
 * // Initialize with default options
 * initDB();
 *
 * @example
 * // Initialize with custom paths
 * initDB({
 *   dbPath: './data/mydb.db',
 *   sqlFilePath: './schema/setup.sql',
 *   verbose: true
 * });
 */
async function initDB(options = {}) {
  // Default options
  const {
    dbPath = "todos.db",
    sqlFilePath = "initDB.sql",
    verbose = false,
  } = options;

  // Resolve paths relative to current directory
  const resolvedSqlPath = path.resolve(process.cwd(), sqlFilePath);
  const resolvedDbPath = path.resolve(process.cwd(), dbPath);

  // Validate SQL file existence
  if (!fs.existsSync(resolvedSqlPath)) {
    const error = new Error(
      `SQL initialization file not found: ${resolvedSqlPath}`,
    );
    console.error("Database initialization failed:", error.message);
    throw error;
  }

  try {
    if (verbose) {
      console.log(`Initializing database at: ${resolvedDbPath}`);
      console.log(`Using SQL file: ${resolvedSqlPath}`);
    }

    // Execute SQLite command to initialize database
    const command = `sqlite3 "${resolvedDbPath}" '.read "${resolvedSqlPath}"'`;
    if (verbose) console.log(`Executing command: ${command}`);

    const { stdout, stderr } = await execPromise(command);

    // Handle potential errors reported in stderr
    if (stderr) {
      console.error("Error initializing database:", stderr);
      throw new Error(`Database initialization failed: ${stderr}`);
    }

    if (stdout && verbose) {
      console.log("SQLite output:", stdout);
    }

    console.log("✅ Database initialized successfully!");
    return { success: true, dbPath: resolvedDbPath };
  } catch (error) {
    console.error("Failed to initialize database:", error.message);
    throw error;
  }
}

// Export a function to run the initialization if this module is executed directly
const runInit = async () => {
  try {
    await initDB({ verbose: true });
    console.log("Database setup complete.");
  } catch (error) {
    console.error("Database setup failed:", error.message);
    process.exit(1);
  }
};

runInit();
