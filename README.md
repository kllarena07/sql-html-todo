# A Simple SQL To-Do App

I decided to create this project to learn some basic SQL operations. I've chosen SQLite for its light footprint and local storage capabilities, Express.js for a lightweight Javascript server framework, and plain HTML to keep things straightforward on the frontend.

This has been a fun little journey into the world of SQL. A lot of different things need to be added to this project, like LOTs of sanitization for security issues and rendering a message when there are no todos. If you find something interesting or have suggestions, let me know!

## Technologies Used

1. SQLite - For easy database management.
2. Express.js - Serving our backend functionality.
3. Plain HTML - Keeping the frontend classic and simple.

## Setup and Run Instructions

Here's how you can get this project up and running on your local machine:

1. Clone the repository:
   ```
   git clone https://github.com/kllarena/sql-html-todo.git
   ```
2. Navigate into the project directory:
   ```
   cd sql-html-todo
   ```
3. Install the backend server dependencies using `pnpm`
   ```
   cd server
   pnpm install
   ```

#### Quick Setup

Before you can start using the app, you'll need to set up the SQLite database. The simplest way to initialize your database with the default schema:

```
node sql/initDB.js
```

You'll see a nice confirmation message when it's done: ✅ Database initialized successfully!

### Running the App

To launch the app, simply run:
```
cd server
pnpm start
```
