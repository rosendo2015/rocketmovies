const knex = require("../database/knex");
class NotesMoviesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const { user_id } = request.params;

    const note_id = await knex("movie_notes").insert({
      title,
      description,
      user_id,
      rating,
    });

    const tagsInsert = tags.map((name) => {
      return {
        name,
        user_id,
        note_id,
      };
    });
    await knex("movie_tags").insert(tagsInsert);
    
    response.json();
  }
  
  
  async show(request, response) {
    const { id } = request.params;
    const note = await knex("movie_notes").where({id});

    const tags = await knex("movie_tags")
    .where({ note_id: id })
    .orderBy("name");
    
    return response.json({ note, tags });
  }
  
  async delete(request, response) {
    const { id } = request.query;
    await knex("movie_notes").where({ id }).delete();
    return response.json();
  }
  
 
}

module.exports = NotesMoviesController;
