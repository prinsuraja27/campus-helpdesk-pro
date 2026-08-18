const db = require('../config/db');

const Admin = {
  async create({ name, email, password, role = 'admin' }) {
    const [result] = await db.execute(
      'INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM admins WHERE id = ?', [id]);
    return rows[0];
  },

  async all() {
    const [rows] = await db.execute('SELECT id, name, email, role, created_at FROM admins ORDER BY created_at DESC');
    return rows;
  }
};

module.exports = Admin;
