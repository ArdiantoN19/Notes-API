/* eslint-disable no-useless-catch */
const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const { mapDBToModel } = require("../../utils/helpers");
// const pool = require("../../db");

class NotesService {
  constructor(collaborationService, cacheService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
    this._cacheService = cacheService;
  }

  async addNote({ title, body, tags, owner }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, body, tags, createdAt, updatedAt, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Catatan gagal ditambahkan");
    }

    await this._cacheService.delete(`notes:${owner}`);

    return result.rows[0].id;
  }

  async getNotes(owner) {
    const keyCache = `notes:${owner}`;
    try {
      // Mendapatkan catatan dari cache
      const result = await this._cacheService.get(keyCache);
      return JSON.parse(result);
    } catch (error) {
      // bila gagal, diteruskan dengan mendapatkan catatan dari database
      const query = {
        text: "SELECT n.* FROM notes n LEFT JOIN collaborations c ON c.note_id = n.id WHERE n.owner = $1 OR c.user_id = $1 GROUP BY n.id",
        values: [owner],
      };

      const result = await this._pool.query(query);
      const mappedResult = result.rows.map(mapDBToModel);

      // Catata akan disimpan pada cache sebelum fungsi getNotes dikembalikan
      await this._cacheService.set(keyCache, JSON.stringify(mappedResult));

      console.log("ok");

      return mappedResult;
    }
  }

  async getNoteById(id) {
    const query = {
      text: "SELECT n.*, u.username FROM notes n LEFT JOIN users u ON u.id = n.owner WHERE n.id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Catatan tidak ditemukan");
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async editNoteById(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id, owner",
      values: [title, body, tags, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui catatan. Id tidak ditemukan");
    }
    const { owner } = result.rows[0];
    await this._cacheService.delete(`notes:${owner}`);
  }

  async deleteNoteById(id) {
    const query = {
      text: "DELETE FROM notes WHERE id = $1 RETURNING id, owner",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Catatan gagal dihapus. Id tidak ditemukan");
    }

    const { owner } = result.rows[0];
    await this._cacheService.delete(`notes:${owner}`);
  }

  async verifyNoteOwner(id, owner) {
    const query = {
      text: "SELECT * FROM notes WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      // ! disini dengan module di dicoding tidak sesuai
      throw new NotFoundError("Catatan tidak ditemukan");
    }

    const note = result.rows[0];
    if (note.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyNoteAccess(noteId, userId) {
    try {
      await this.verifyNoteOwner(noteId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;

      try {
        await this._collaborationService.verifyCollaborator(noteId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = NotesService;
