const { Router } = require("express");
const NotesMoviesController = require("../controllers/NotesMoviesController");
const noteMoviesRoutes = Router()
const notesMoviesController = new NotesMoviesController();



noteMoviesRoutes.post("/:user_id", notesMoviesController.create)
noteMoviesRoutes.get("/:id", notesMoviesController.show)
noteMoviesRoutes.delete("/:id", notesMoviesController.delete)


module.exports = noteMoviesRoutes;