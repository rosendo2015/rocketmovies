const { hash, compare } = require("bcryptjs");
const { response } = require("express");
const AppError = require("../../utils/AppError");
const sqliteConnection = require("../database/sqlite");
class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;
    const database = await sqliteConnection();
    const checkUserExistsEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );
    if (checkUserExistsEmail) {
      throw new AppError("Eamil já está em uso.");
    }
    const hashedPassword = await hash(password, 8);
    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

    if (!user) {
      throw new AppError("Usuário não encontrado.");
    }
    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Email já está em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError("Necessário informar a senha antiga para esta ação");
    }
    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);
      if (!checkOldPassword) {
        throw new AppError("O email antigo não confere com o cadastrado");
      }
      user.password = await hash(password, 8);
    }

    await database.run(
      `
    UPDATE  users SET
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`,
      [user.name, user.email, user.password, id]
    );

    return response.status(200).json();
  }

  async delete(request, response){

  }
}
module.exports = UsersController;
