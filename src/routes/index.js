const { Router } = require("express");
const usersRouter = require("./users.routes");
const notesMoviesRouter = require("./notes.routes");
const routes = Router();
routes.use("/users", usersRouter);
routes.use("/notes", notesMoviesRouter);
module.exports = routes;