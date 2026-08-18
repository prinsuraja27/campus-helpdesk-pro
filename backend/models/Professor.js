const db = require('../config/db');

const Professor = {
  async create({ name, email, password, department_id }) {
    const [result] = await db.execute(
      'INSERT INTO professors (name, email, password, department_id) VALUES (?, ?, ?, ?)',
      [name, email, password, department_id]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM professors WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM professors WHERE id = ?', [id]);
    return rows[0];
  },

  async all() {
    const [rows] = await db.execute('SELECT * FROM professors');
    return rows;
  }
};

module.exports = Professor;
