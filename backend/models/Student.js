const db = require('../config/db');

const Student = {
  async create({ student_id, name, email, phone, password }) {
    const [result] = await db.execute(
      'INSERT INTO students (student_id, name, email, phone, password) VALUES (?, ?, ?, ?, ?)',
      [student_id, name, email, phone, password]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM students WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM students WHERE id = ?', [id]);
    return rows[0];
  },

  async all() {
    const [rows] = await db.execute('SELECT * FROM students');
    return rows;
  }
};

module.exports = Student;
